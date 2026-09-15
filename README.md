# Kumo

Cloudflare 用于构建现代 Web 应用的组件库。

Kumo 提供基于 [Base UI](https://base-ui.com/) 构建、符合设计系统规范的无障碍 UI 组件。它替你处理键盘导航、焦点管理与 ARIA 属性，让你无需逐一斟酌细节即可构建无障碍应用。

<img width="2560" height="1456" alt="image" src="https://github.com/user-attachments/assets/032f5a0e-b686-4440-b1ca-6182379479aa" />

## 安装

```bash
pnpm add @cloudflare/kumo
```

### 同级依赖（Peer Dependencies）

```bash
pnpm add react react-dom @phosphor-icons/react
```

## 用法

```tsx
import { Button, Input, Dialog } from "@cloudflare/kumo";
import "@cloudflare/kumo/styles";
```

### 细粒度导入（Tree-Shaking）

```tsx
import { Button } from "@cloudflare/kumo/components/button";
```

### Base UI 基础组件（Primitives）

Kumo 重新导出了全部 Base UI 基础组件，用于进阶使用场景：

```tsx
import { Popover } from "@cloudflare/kumo/primitives/popover";
```

## CLI

在命令行查询组件文档：

```bash
npx @cloudflare/kumo ls          # 列出全部组件
npx @cloudflare/kumo doc Button  # 获取组件文档
npx @cloudflare/kumo docs        # 获取全部文档
```

## 开发

完整的开发文档参见 [AGENTS.md](./AGENTS.md)，包括：

- 组件模式与样式系统
- 语义化颜色令牌
- 开发工作流
- CI/CD 流水线
- Figma 插件

### 快速开始

```bash
pnpm install
pnpm dev                    # 在 localhost:4321 启动文档站点
pnpm --filter @cloudflare/kumo test
```

### Figma 插件

```bash
# 可选：在构建时启用令牌同步
# cp packages/kumo-figma/scripts/.env.example packages/kumo-figma/scripts/.env
# $EDITOR packages/kumo-figma/scripts/.env  # 设置 FIGMA_TOKEN（可选 FIGMA_FILE_KEY）

pnpm --filter @cloudflare/kumo-figma build
# 在 Figma 中：Plugins > Development > Import plugin from manifest...
# 选择：packages/kumo-figma/src/manifest.json
```

### 创建组件

```bash
pnpm --filter @cloudflare/kumo new-component
```

## 文档

- **在线文档**：[kumo-ui.com](https://kumo-ui.com)
- **AI/Agent 指南**：[AGENTS.md](./AGENTS.md)

## 许可

MIT
