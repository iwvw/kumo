---
name: kumo-design
description: Cloudflare product design guidance. Use when designing, implementing, or reviewing Cloudflare dashboard interfaces, Kumo UI, responsive styling, dialogs, or frontend tests.
---

# Cloudflare Design

Apply these rules when designing, implementing, or reviewing Cloudflare product interfaces. Follow recommended examples and avoid patterns marked as examples to avoid.

## Rules

### `content-text-size` 正文文本使用 14px

所有正文文本——正文、按钮、数据及其他可交互元素——的尺寸都必须是 14px。16px 及以上仅限用于标题和副标题。

**Good**

```tsx
<Text>Content text</Text>
```

**Avoid**

```tsx
<Text size="lg">Content text</Text>
```

### `heading-case` 标题始终使用句子式大小写

切勿对标题全部使用大写字母。产品名称必须使用标题式大写。

**Good**

```tsx
<Text as="h2">Recent requests</Text>
```

**Avoid**

```tsx
<Text as="h2">Recent Requests</Text>
```

```tsx
<Text as="h2" DANGEROUS_className="uppercase">Recent requests</Text>
```

### `font-tracking` 切勿更改字体的字距

不要使用 `tracking-*` 类来更改字符之间的间距。

**Good**

```tsx
<span className="text-lg">Worker 指标</span>
```

**Avoid**

```tsx
<span className="text-lg tracking-tight">Worker 指标</span>
```

### `font-weight` 切勿使用 `font-bold`

标题使用 `font-semibold`，粗体行内文本使用 `font-medium`。

**Good**

```tsx
<Text as="h3" variant="heading">Account settings</Text>
<Text as="strong" bold>required</Text>
```

**Avoid**

```tsx
<Text as="h3" DANGEROUS_className="font-bold">Account settings</Text>
<Text as="strong" DANGEROUS_className="font-bold">required</Text>
```

### `related-text-spacing` 将相关文本排放得更靠近

相关文本周围的间距应当小于其所属内容的间距。

**Good**

```tsx
<div className="grid gap-6">
  <div className="grid gap-1.5">
    <Text as="h3" variant="heading">Web Analytics</Text>
    <Text>Measure site traffic without changing your code.</Text>
  </div>
  <Button>Configure</Button>
</div>
```

**Avoid**

```tsx
<div className="grid gap-4">
  <Text as="h3" variant="heading">Web Analytics</Text>
  <Text>Measure site traffic without changing your code.</Text>
  <Button>Configure</Button>
</div>
```

### `text-spacing` 围绕文本进行光学对齐排布

文本周围的间距应考虑到其行高。通常这意味着垂直间距应略小于水平间距。

**Good**

```tsx
<LayerCard className="px-5 py-4">...</LayerCard>
```

**Avoid**

```tsx
<LayerCard className="p-5">...</LayerCard>
```

### `hover-color-transitions` 切勿为悬停状态过渡颜色

悬停时的颜色变化必须立即完成。对快速交互使用过渡会让界面显得迟钝。

**Good**

```tsx
<button className="hover:bg-kumo-tint">...</button>
```

**Avoid**

```tsx
<button className="transition-colors duration-300 hover:bg-kumo-tint">...</button>
```

### `shadow-borders` 切勿将边框与投影一起使用

使用 `ring ring-kumo-line` 创建保持清晰边缘的透明边框。

**Good**

```tsx
<LayerCard className="shadow-md ring ring-kumo-line">...</LayerCard>
```

**Avoid**

```tsx
<LayerCard className="border border-kumo-line shadow-md">...</LayerCard>
```

### `concentric-border-radius` 使用同心圆角

当边框或圆环彼此相隔 8px 或更近时，其圆角半径必须在数学上同心：外半径 = 内半径 + 内边距。

**Good**

```tsx
<div className="rounded-xl p-1">
  <div className="rounded-lg">...</div>
</div>
```

**Avoid**

```tsx
<div className="rounded-xl p-1">
  <div className="rounded-xl">...</div>
</div>
```

### `icon-alignment` 将图标与文本首行对齐

行内图标在视觉上必须与文本尺寸相同并居中对齐。多行对齐请使用 `h-lh flex items-center`。

**Good**

```tsx
<div className="flex items-start gap-2">
  <span className="h-lh flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>
```

**Avoid**

```tsx
<div className="flex items-start gap-2">
  <span className="flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>
```

```tsx
<div className="flex items-center gap-2">
  <Icon />
  <Text>Text that may wrap onto multiple lines</Text>
</div>
```

### `inline-monospace-size` 缩小行内等宽文本的字号

等宽文本与普通文本混合时，应使用略小的字号（约 0.9em）。

**Good**

```tsx
<Text size="lg">
  编辑 <span className="font-mono text-[0.9em]">wrangler.toml</span>{" "}
  以继续。
</Text>
```

**Avoid**

```tsx
<Text size="lg">
  编辑 <span className="font-mono">wrangler.toml</span> 以继续。
</Text>
```

### `sticky-borders` 使用 `border` 将吸顶元素与内容分隔开

**Good**

```tsx
<div className="sticky top-0 border-b border-kumo-line">...</div>
```

**Avoid**

```tsx
<div className="sticky top-0">...</div>
```

### `collapse-content-size` 在折叠动画期间保持内容尺寸

可折叠内容在关闭时必须保持其内容尺寸，以避免内容在动画期间发生位移。

**Good**

```tsx
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">...</div>
</motion.div>
```

**Avoid**

```tsx
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">...</div>
</motion.div>
```

### `layer-card-nesting` 切勿将 `LayerCard` 相互层叠

**Good**

```tsx
<div>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</div>
```

**Avoid**

```tsx
<LayerCard>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</LayerCard>
```

### `dialog-rendering` 切勿按条件渲染 Dialog

按条件渲染对话框会禁用其打开/关闭动画。请使用 `open` 属性来判断对话框是否可见。

**Good**

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog>
    <Dialog.Title>Edit Worker</Dialog.Title>
    <Dialog.Description>Update this Worker's settings.</Dialog.Description>
  </Dialog>
</Dialog.Root>
```

**Avoid**

```tsx
{open && (
  <Dialog.Root open>
    <Dialog>
      <Dialog.Title>Edit Worker</Dialog.Title>
    </Dialog>
  </Dialog.Root>
)}
```
