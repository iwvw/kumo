# sync-kumo-docs.ps1
#
# 监控 cloudflare/kumo 上游仓库（kumo-ui.com 文档源），发现新提交时：
#   1. git fetch origin main
#   2. 若有新提交 -> 将 origin/main 合并进本地 zh 分支（保留汉化改动）
#   3. pnpm install + 重建 kumo 包 + 重建文档站点
#   4. 用 wrangler 部署到 Cloudflare Pages (kumo-docs-zh) -> kumo.dsuk.top
#   5. 记录变更文件清单（涉及已翻译页面的需人工补译）到 sync.log
#
# 用法：
#   powershell -ExecutionPolicy Bypass -File tools\sync-kumo-docs.ps1 [-Force]

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$RepoRoot = "E:\Code\kumo-docs-zh"
$NodeDir = "C:\Users\DSUK\AppData\Local\Programs\node24\node-v24.12.0-win-x64"
$PnpmCmd = "C:\Users\DSUK\AppData\Roaming\npm\pnpm.cmd"
$LogFile = Join-Path $RepoRoot "sync.log"

$env:PATH = "${NodeDir};C:\Users\DSUK\AppData\Roaming\npm;" + $env:PATH

function Write-Log {
    param([string]$Message)
    $line = "[{0:yyyy-MM-dd HH:mm:ss}] {1}" -f (Get-Date), $Message
    Add-Content -Path $LogFile -Value $line -Encoding utf8
    Write-Host $line
}

Set-Location $RepoRoot

# 载入 Cloudflare 凭据（不入库）
$envFile = Join-Path $RepoRoot "tools\cloudflare.env"
if (-not (Test-Path $envFile)) {
    Write-Log "ERROR: missing $envFile (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID)"
    exit 1
}
foreach ($line in Get-Content $envFile) {
    if ($line -match '^\s*([^#][^=]+)=(.*)$') {
        Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim()
    }
}
if (-not $env:CLOUDFLARE_API_TOKEN) { Write-Log "ERROR: CLOUDFLARE_API_TOKEN not set"; exit 1 }

# 记录上次构建来源（合并后即为 new HEAD）
function Resolve-ChangedPages {
    param([string]$Base, [string]$Head)
    git diff --name-only "$Base..$Head" -- packages/kumo-docs-astro/src/pages packages/kumo-docs-astro/src/components packages/kumo-docs-astro/src/layouts 2>$null
}

Write-Log "=== sync start ==="

# 1) fetch 上游
git fetch origin main 2>&1 | Out-Null
$upstreamSha = git rev-parse origin/main
$localHead = git rev-parse HEAD

# 2) 检查是否有新提交
$isAncestor = git merge-base --is-ancestor HEAD origin/main
if ($LASTEXITCODE -eq 0 -and -not $Force) {
    Write-Log "no upstream change (both at $($upstreamSha.Substring(0,8)))"
    exit 0
}
if (-not $Force) {
    Write-Log "upstream changed: $($localHead.Substring(0,8)) -> $($upstreamSha.Substring(0,8))"
} else {
    Write-Log "forced sync at upstream $($upstreamSha.Substring(0,8))"
}

# 记录本次将吸收的变更文件
$mergeBase = git merge-base HEAD origin/main
$changedPages = @(Resolve-ChangedPages $mergeBase $upstreamSha)

# 3) 合并上游到 zh
git merge origin/main --no-edit 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Log "MERGE CONFLICT with origin/main. Aborting. Resolve manually, then run sync again."
    git status --short 2>&1 | ForEach-Object { Write-Log "  CONFLICT FILE: $_" }
    exit 1
}
$newHead = git rev-parse HEAD
Write-Log "merged origin/main -> zh ($($newHead.Substring(0,8)))"

# 4) 安装依赖 + 重建
Write-Log "pnpm install..."
& $PnpmCmd install --package-import-method=copy 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Log "ERROR: pnpm install failed"; exit 1 }

Write-Log "building @cloudflare/kumo..."
& $PnpmCmd --filter @cloudflare/kumo build 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Log "ERROR: kumo build failed"; exit 1 }

Write-Log "building docs..."
& $PnpmCmd --filter @cloudflare/kumo-docs-astro build 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Log "ERROR: docs build failed"; exit 1 }

# 5) 部署到 Cloudflare Pages
$docsDir = Join-Path $RepoRoot "packages\kumo-docs-astro"
Set-Location $docsDir
Write-Log "deploying to Cloudflare Pages (kumo-docs-zh)..."
& "$docsDir\node_modules\.bin\wrangler.cmd" pages deploy dist --project-name=kumo-docs-zh --branch=main 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Log "ERROR: wrangler deploy failed"; exit 1 }
Set-Location $RepoRoot

# 6) 收尾：提交合并且清理
git add -A 2>&1 | Out-Null
git -c user.name="iwvw" -c user.email="2285740204@qq.com" commit -m "chore(zh): sync upstream $($upstreamSha.Substring(0,8))" 2>&1 | Out-Null

# 7) 变更文件报告（可能需补译）
Write-Log "=== sync OK: HEAD=$($newHead.Substring(0,8)) upstream=$($upstreamSha.Substring(0,8)) ==="
if ($changedPages.Count -gt 0) {
    Write-Log "Changed docs files in this sync (may need translation refresh):"
    foreach ($p in $changedPages) { Write-Log "  - $p" }
} else {
    Write-Log "No docs content files changed (kumo source / deps only)."
}

# 桌面通知（可选，未安装 BurntToast 时忽略）
try {
    Import-Module BurntToast -ErrorAction Stop
    New-BurntToastNotification -Text "Kumo 文档站点已更新" -ErrorAction Stop
} catch {
    # 忽略
}

Write-Log "=== sync done ==="
exit 0