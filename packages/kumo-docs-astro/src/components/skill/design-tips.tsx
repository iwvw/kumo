import { Button, LayerCard, Text } from "@cloudflare/kumo";
import { CodeHighlighted } from "@cloudflare/kumo/code";
import { WarningIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { CollapseSizeExample } from "./CollapseSizeExample";

export interface DesignTipExample {
  variant: "good" | "bad";
  exampleCode?: string;
  jsx: ReactNode;
}

export interface DesignTip {
  id: string;
  title: string;
  description?: string;
  examples: DesignTipExample[];
}

interface CodeExampleProps {
  code: string;
}

export function CodeExample({ code }: CodeExampleProps) {
  return (
    <CodeHighlighted
      className="code-block rounded-none border-0 bg-transparent p-2 [&_pre]:text-base!"
      code={code}
      lang="tsx"
    />
  );
}

export const designTips = [
  {
    id: "content-text-size",
    title: "正文文本使用 14px",
    description:
      "所有正文文本——正文、按钮、数据及其他可交互元素——的尺寸都必须是 14px。16px 及以上仅限用于标题和副标题。",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text>Content text</Text>`,
        jsx: (
          <LayerCard className="grid w-full gap-1 p-5">
            <Text as="h3" variant="heading">
              API 令牌
            </Text>
            <Text>生产令牌将在 30 天后过期。</Text>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text size="lg">Content text</Text>`,
        jsx: (
          <LayerCard className="grid w-full gap-1 p-5">
            <Text as="h3" variant="heading">
              API 令牌
            </Text>
            <Text size="lg">生产令牌将在 30 天后过期。</Text>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "heading-case",
    title: "标题始终使用句子式大小写",
    description:
      "切勿对标题全部使用大写字母。产品名称必须使用标题式大写。",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text as="h2">Recent requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>最近请求</LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h2">Recent Requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>
              <span className="capitalize">最近请求</span>
            </LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h2" DANGEROUS_className="uppercase">Recent requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>
              <span className="uppercase">最近请求</span>
            </LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "font-tracking",
    title: "切勿更改字体的字距",
    description:
      "不要使用 `tracking-*` 类来更改字符之间的间距。",
    examples: [
      {
        variant: "good",
        jsx: <span className="text-lg">Worker 指标</span>,
      },
      {
        variant: "bad",
        jsx: <span className="text-lg tracking-tight">Worker 指标</span>,
      },
    ],
  },
  {
    id: "font-weight",
    title: "切勿使用 `font-bold`",
    description:
      "标题使用 `font-semibold`，粗体行内文本使用 `font-medium`。",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text as="h3" variant="heading">Account settings</Text>
<Text as="strong" bold>required</Text>`,
        jsx: (
          <div className="grid gap-1">
            <Text as="h3" variant="heading">
              账户设置
            </Text>
            <Text>
              此操作是{" "}
              <Text as="strong" bold>
                必需的
              </Text>
              。
            </Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h3" DANGEROUS_className="font-bold">Account settings</Text>
<Text as="strong" DANGEROUS_className="font-bold">required</Text>`,
        jsx: (
          <div className="grid gap-1">
            <Text as="h3" DANGEROUS_className="text-lg font-bold">
              账户设置
            </Text>
            <Text>
              此操作是{" "}
              <Text as="strong" DANGEROUS_className="font-bold">
                必需的
              </Text>
              。
            </Text>
          </div>
        ),
      },
    ],
  },
  {
    id: "related-text-spacing",
    title: "将相关文本排放得更靠近",
    description:
      "相关文本周围的间距应当小于其所属内容的间距。",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="grid gap-6">
  <div className="grid gap-1.5">
    <Text as="h3" variant="heading">Web Analytics</Text>
    <Text>Measure site traffic without changing your code.</Text>
  </div>
  <Button>Configure</Button>
</div>`,
        jsx: (
          <LayerCard className="w-full p-5">
            <div className="grid gap-6">
              <div className="grid gap-1.5">
                <Text as="h3" variant="heading">
                  Web 分析
                </Text>
                <Text variant="secondary" DANGEROUS_className="text-pretty">
                  无需更改代码即可衡量站点流量。
                </Text>
              </div>
              <Button className="justify-self-start">配置</Button>
            </div>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="grid gap-4">
  <Text as="h3" variant="heading">Web Analytics</Text>
  <Text>Measure site traffic without changing your code.</Text>
  <Button>Configure</Button>
</div>`,
        jsx: (
          <LayerCard className="w-full p-5">
            <div className="grid gap-4">
              <Text as="h3" variant="heading">
                Web 分析
              </Text>
              <Text variant="secondary" DANGEROUS_className="text-pretty">
                无需更改代码即可衡量站点流量。
              </Text>
              <Button className="justify-self-start">配置</Button>
            </div>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "text-spacing",
    title: "围绕文本进行光学对齐排布",
    description:
      "文本周围的间距应考虑到其行高。通常这意味着垂直间距应略小于水平间距。",
    examples: [
      {
        variant: "good",
        exampleCode: `<LayerCard className="px-5 py-4">...</LayerCard>`,
        jsx: (
          <LayerCard className="px-5 py-4">
            <Text bold>生产</Text>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard className="p-5">...</LayerCard>`,
        jsx: (
          <LayerCard className="p-5">
            <Text bold>生产</Text>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "hover-color-transitions",
    title: "切勿为悬停状态过渡颜色",
    description:
      "悬停时的颜色变化必须立即完成。对快速交互使用过渡会让界面显得迟钝。",
    examples: [
      {
        variant: "good",
        exampleCode: `<button className="hover:bg-kumo-tint">...</button>`,
        jsx: (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-kumo-base px-4 py-2 font-medium ring ring-kumo-line hover:bg-kumo-tint"
          >
            悬停我
          </button>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<button className="transition-colors duration-300 hover:bg-kumo-tint">...</button>`,
        jsx: (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-kumo-base px-4 py-2 font-medium ring ring-kumo-line transition-colors duration-300 hover:bg-kumo-tint"
          >
            悬停我
          </button>
        ),
      },
    ],
  },
  {
    id: "shadow-borders",
    title: "切勿将边框与投影一起使用",
    description:
      "使用 `ring ring-kumo-line` 创建保持清晰边缘的透明边框。",
    examples: [
      {
        variant: "good",
        exampleCode: `<LayerCard className="shadow-md ring ring-kumo-line">...</LayerCard>`,
        jsx: (
          <LayerCard className="w-full shadow-md ring ring-kumo-line">
            <LayerCard.Primary className="grid gap-1 p-5">
              <Text as="h3" variant="heading">
                Workers API
              </Text>
              <Text variant="secondary">4 分钟前部署</Text>
            </LayerCard.Primary>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard className="border border-kumo-line shadow-md">...</LayerCard>`,
        jsx: (
          <LayerCard className="w-full border border-kumo-line shadow-md ring-0">
            <LayerCard.Primary className="grid gap-1 p-5 ring-0">
              <Text as="h3" variant="heading">
                Workers API
              </Text>
              <Text variant="secondary">4 分钟前部署</Text>
            </LayerCard.Primary>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "concentric-border-radius",
    title: "使用同心圆角",
    description:
      "当边框或圆环彼此相隔 8px 或更近时，其圆角半径必须在数学上同心：外半径 = 内半径 + 内边距。",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="rounded-xl p-1">
  <div className="rounded-lg">...</div>
</div>`,
        jsx: (
          <div className="size-40 overflow-hidden">
            <div className="size-80 rounded-[48px] bg-kumo-tint p-4 ring-2 ring-kumo-line ring-inset">
              <div className="size-full rounded-4xl bg-kumo-base ring-2 ring-kumo-line ring-inset" />
            </div>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="rounded-xl p-1">
  <div className="rounded-xl">...</div>
</div>`,
        jsx: (
          <div className="size-40 overflow-hidden">
            <div className="size-80 rounded-[48px] bg-kumo-tint p-4 ring-2 ring-kumo-line ring-inset">
              <div className="size-full rounded-[48px] bg-kumo-base ring-2 ring-kumo-line ring-inset" />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "icon-alignment",
    title: "将图标与文本首行对齐",
    description:
      "行内图标在视觉上必须与文本尺寸相同并居中对齐。多行对齐请使用 `h-lh flex items-center`。",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="flex items-start gap-2">
  <span className="h-lh flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-start gap-2">
            <span className="flex h-lh shrink-0 items-center">
              <WarningIcon aria-hidden="true" size={14} />
            </span>
            <Text>API 令牌的权限在创建后无法更改。</Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="flex items-start gap-2">
  <span className="flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-start gap-2">
            <span className="flex shrink-0 items-center">
              <WarningIcon aria-hidden="true" size={14} />
            </span>
            <Text>API 令牌的权限在创建后无法更改。</Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="flex items-center gap-2">
  <Icon />
  <Text>Text that may wrap onto multiple lines</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-center gap-2">
            <WarningIcon aria-hidden="true" className="shrink-0" size={14} />
            <Text>API 令牌的权限在创建后无法更改。</Text>
          </div>
        ),
      },
    ],
  },
  {
    id: "inline-monospace-size",
    title: "缩小行内等宽文本的字号",
    description:
      "等宽文本与普通文本混合时，应使用略小的字号（约 0.9em）。",
    examples: [
      {
        variant: "good",
        jsx: (
          <Text size="lg">
            编辑 <span className="font-mono text-[0.9em]">wrangler.toml</span>{" "}
            以继续。
          </Text>
        ),
      },
      {
        variant: "bad",
        jsx: (
          <Text size="lg">
            编辑 <span className="font-mono">wrangler.toml</span> 以继续。
          </Text>
        ),
      },
    ],
  },
  {
    id: "sticky-borders",
    title: "使用 `border` 将吸顶元素与内容分隔开",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="sticky top-0 border-b border-kumo-line">...</div>`,
        jsx: (
          <LayerCard className="h-56 w-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-kumo-line bg-kumo-base px-3 py-2">
              <Text bold>API 令牌</Text>
              <Button size="sm">创建</Button>
            </div>
            <div className="grid gap-4 p-3">
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
            </div>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="sticky top-0">...</div>`,
        jsx: (
          <LayerCard className="h-56 w-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-kumo-base px-3 py-2">
              <Text bold>API 令牌</Text>
              <Button size="sm">创建</Button>
            </div>
            <div className="grid gap-4 p-3">
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
            </div>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "collapse-content-size",
    title: "在折叠动画期间保持内容尺寸",
    description:
      "可折叠内容在关闭时必须保持其内容尺寸，以避免内容在动画期间发生位移。",
    examples: [
      {
        variant: "good",
        exampleCode: `<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">...</div>
</motion.div>`,
        jsx: <CollapseSizeExample preserveContentSize />,
      },
      {
        variant: "bad",
        exampleCode: `<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">...</div>
</motion.div>`,
        jsx: <CollapseSizeExample />,
      },
    ],
  },
  {
    id: "layer-card-nesting",
    title: "切勿将 `LayerCard` 相互层叠",
    examples: [
      {
        variant: "good",
        exampleCode: `<div>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</div>`,
        jsx: (
          <div className="grid w-full">
            <div className="flex h-10 items-center">
              <Text as="h3" bold>
                最近请求
              </Text>
            </div>
            <LayerCard>
              <LayerCard.Secondary className="grid h-12 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text bold size="sm">
                  时间
                </Text>
                <Text bold size="sm">
                  状态
                </Text>
                <Text bold size="sm">
                  查询
                </Text>
              </LayerCard.Secondary>
              <LayerCard.Primary className="grid h-10 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text size="sm">00:50 UTC</Text>
                <Text size="sm" variant="error">
                  错误
                </Text>
                <Text size="sm">kumo</Text>
              </LayerCard.Primary>
            </LayerCard>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</LayerCard>`,
        jsx: (
          <LayerCard className="w-full">
            <div className="flex h-10 items-center px-3">
              <Text as="h3" bold>
                最近请求
              </Text>
            </div>
            <LayerCard>
              <LayerCard.Secondary className="grid h-12 grid-cols-3 gap-4 px-3 py-0">
                <Text bold>时间</Text>
                <Text bold>状态</Text>
                <Text bold>查询</Text>
              </LayerCard.Secondary>
              <LayerCard.Primary className="grid h-10 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text>00:50 UTC</Text>
                <Text variant="error">错误</Text>
                <Text>kumo</Text>
              </LayerCard.Primary>
            </LayerCard>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "dialog-rendering",
    title: "切勿按条件渲染 Dialog",
    description:
      "按条件渲染对话框会禁用其打开/关闭动画。请使用 `open` 属性来判断对话框是否可见。",
    examples: [
      {
        variant: "good",
        jsx: (
          <CodeExample
            code={`<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog>
    <Dialog.Title>Edit Worker</Dialog.Title>
    <Dialog.Description>Update this Worker's settings.</Dialog.Description>
  </Dialog>
</Dialog.Root>`}
          />
        ),
      },
      {
        variant: "bad",
        jsx: (
          <CodeExample
            code={`{open && (
  <Dialog.Root open>
    <Dialog>
      <Dialog.Title>Edit Worker</Dialog.Title>
    </Dialog>
  </Dialog.Root>
)}`}
          />
        ),
      },
    ],
  },
] satisfies DesignTip[];
