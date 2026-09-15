import { useState } from "react";
import {
  Autocomplete,
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  ClipboardText,
  Collapsible,
  Combobox,
  DatePicker,
  Dialog,
  DropdownMenu,
  Flow,
  Grid,
  GridItem,
  Input,
  InputArea,
  Label,
  LayerCard,
  Link,
  Loader,
  Meter,
  Pagination,
  Popover,
  Radio,
  Select,
  SensitiveInput,
  SkeletonLine,
  Switch,
  Table,
  TableOfContents,
  TagInput,
  Tabs,
  Text,
  Toolbar,
  Toasty,
  Tooltip,
  TooltipProvider,
  useKumoToastManager,
} from "@cloudflare/kumo";
import { ShikiProvider, CodeHighlighted } from "@cloudflare/kumo/code";
import { CommandPaletteBasicDemo } from "~/components/demos/CommandPaletteDemo";
import { InputGroupDemo } from "~/components/demos/InputGroupDemo";
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TranslateIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
} from "@phosphor-icons/react";

const componentRoutes: Record<string, string> = {
  badge: "/components/badge",
  banner: "/components/banner",
  breadcrumbs: "/components/breadcrumbs",
  button: "/components/button",
  "button-group": "/components/button-group",
  checkbox: "/components/checkbox",
  "clipboard-text": "/components/clipboard-text",
  "code-highlighted": "/components/code-highlighted",
  collapsible: "/components/collapsible",
  autocomplete: "/components/autocomplete",
  combobox: "/components/combobox",
  "command-palette": "/components/command-palette",
  "date-picker": "/components/date-picker",
  dialog: "/components/dialog",
  dropdown: "/components/dropdown",
  empty: "/components/empty",
  flow: "/components/flow",
  grid: "/components/grid",
  input: "/components/input",
  "input-area": "/components/input-area",
  "input-group": "/components/input-group",
  "tag-input": "/components/tag-input",
  label: "/components/label",
  "layer-card": "/components/layer-card",
  link: "/components/link",
  loader: "/components/loader",
  meter: "/components/meter",
  pagination: "/components/pagination",
  popover: "/components/popover",
  radio: "/components/radio",
  select: "/components/select",
  "sensitive-input": "/components/sensitive-input",
  "skeleton-line": "/components/skeleton-line",
  switch: "/components/switch",
  table: "/components/table",
  "table-of-contents": "/components/table-of-contents",
  tabs: "/components/tabs",
  text: "/components/text",
  toolbar: "/components/toolbar",
  toast: "/components/toast",
  tooltip: "/components/tooltip",
};

function ToastTriggerButton() {
  const toastManager = useKumoToastManager();
  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: `Toast 已创建`,
          description: "这是一条 Toast 通知。",
          variant: "warning",
        })
      }
    >
      给我一个 Toast
    </Button>
  );
}

export function HomeGrid() {
  const [switchToggled, setSwitchToggled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [value, setValue] = useState<{ id: string; value: string } | null>(
    null,
  );

  const components: Array<{
    name: string;
    id: string;
    Component: React.ReactNode;
  }> = [
    {
      name: "Button",
      id: "button",
      Component: (
        <div className="grid gap-3">
          <Button icon={PlusIcon}>创建 Worker</Button>
          <Button variant="primary" icon={PlusIcon}>
            创建 Worker
          </Button>
          <Button loading>创建 Worker</Button>
        </div>
      ),
    },
    {
      name: "Button Group",
      id: "button-group",
      Component: (
        <ButtonGroup>
          <Button variant="primary">部署</Button>
          <Button variant="primary" shape="square" aria-label="更多选项">
            <CaretDownIcon />
          </Button>
        </ButtonGroup>
      ),
    },
    {
      name: "Input",
      id: "input",
      Component: (
        <div className="grid gap-3">
          <Input placeholder="输入内容..." />
          <Input variant="error" value="无效！" />
        </div>
      ),
    },
    {
      name: "Tag Input",
      id: "tag-input",
      Component: (
        <TagInput
          className="w-[280px]"
          defaultValue={["frontend", "priority"]}
          placeholder="添加标签"
        />
      ),
    },
    {
      name: "Select",
      id: "select",
      Component: (
        <Select
          aria-label="选择版本"
          className="w-[200px]"
          placeholder="选择版本"
          renderValue={(v) => {
            const labels: Record<string, string> = {
              all: "全部已部署版本",
              active: "活跃版本",
              specific: "指定版本",
            };
            if (!v) return "选择版本…";
            return labels[v as string];
          }}
        >
          <Select.Option value="all">全部已部署版本</Select.Option>
          <Select.Option value="active">活跃版本</Select.Option>
          <Select.Option value="specific">指定版本</Select.Option>
        </Select>
      ),
    },
    {
      name: "Toolbar",
      id: "toolbar",
      Component: (
        <Toolbar>
          <Toolbar.Input
            aria-label="搜索 DNS 记录"
            placeholder="搜索…"
          />
          <Toolbar.Button icon={MagnifyingGlassIcon} aria-label="搜索" />
          <Toolbar.Button icon={PlusIcon} aria-label="添加" />
        </Toolbar>
      ),
    },
    {
      name: "Autocomplete",
      id: "autocomplete",
      Component: (
        <Autocomplete
          items={["Apple", "Banana", "Cherry", "Grape", "Mango", "Orange"]}
        >
          <Autocomplete.InputGroup placeholder="搜索水果…" />
          <Autocomplete.Content>
            <Autocomplete.List>
              {(item: string) => (
                <Autocomplete.Item key={item} value={item}>
                  {item}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Content>
        </Autocomplete>
      ),
    },
    {
      name: "Combobox",
      id: "combobox",
      Component: (
        <Combobox
          items={[
            { id: "bug", value: "bug" },
            { id: "docs", value: "documentation" },
            { id: "enhancement", value: "enhancement" },
            { id: "help-wanted", value: "help wanted" },
            { id: "good-first-issue", value: "good first issue" },
          ]}
          onValueChange={setValue}
          value={value}
        >
          <Combobox.TriggerInput placeholder="选择一个问题…" />
          <Combobox.Content>
            <Combobox.List>
              {(item: { id: string; value: string }) => (
                <Combobox.Item key={item.id} value={item.value}>
                  {item.value}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      ),
    },
    {
      name: "Switch",
      id: "switch",
      Component: (
        <Switch
          checked={switchToggled}
          onClick={() => {
            setSwitchToggled(!switchToggled);
          }}
        />
      ),
    },
    {
      name: "Input (with validation)",
      id: "input",
      Component: (
        <Input
          label="邮箱"
          placeholder="name@example.com"
          type="email"
          variant="error"
          error={{
            message: "请输入有效的邮箱地址。",
            match: "typeMismatch",
          }}
          description="用于接收通知的邮箱。"
        />
      ),
    },
    {
      name: "Dialog",
      id: "dialog",
      Component: (
        <Dialog.Root>
          <Dialog.Trigger render={(p) => <Button {...p}>删除</Button>} />
          <Dialog className="p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-2xl font-semibold">
                删除该资源？
              </Dialog.Title>
              <Dialog.Close
                aria-label="关闭"
                render={(props) => (
                  <Button
                    {...props}
                    variant="secondary"
                    shape="square"
                    icon={<XIcon />}
                    aria-label="关闭"
                  />
                )}
              />
            </div>
            <Dialog.Description className="text-kumo-subtle">
              这是一段用于演示的示例正文，展示对话框描述文本的样式。
            </Dialog.Description>
            <div className="mt-8 flex justify-end gap-2">
              <Dialog.Close
                render={(props) => (
                  <Button variant="secondary" {...props}>
                    取消
                  </Button>
                )}
              />
              <Dialog.Close
                render={(props) => (
                  <Button variant="destructive" {...props}>
                    删除
                  </Button>
                )}
              />
            </div>
          </Dialog>
        </Dialog.Root>
      ),
    },
    {
      name: "Tooltip",
      id: "tooltip",
      Component: (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip
              content="添加"
              open
              render={
                <Button shape="square" icon={PlusIcon} aria-label="添加" />
              }
            />
            <Tooltip
              content="切换语言"
              render={
                <Button
                  shape="square"
                  icon={TranslateIcon}
                  aria-label="切换语言"
                />
              }
            />
          </div>
        </TooltipProvider>
      ),
    },
    {
      name: "Dropdown",
      id: "dropdown",
      Component: (
        <DropdownMenu>
          <DropdownMenu.Trigger render={<Button icon={PlusIcon}>添加</Button>} />
          <DropdownMenu.Content>
            <DropdownMenu.Item>Worker</DropdownMenu.Item>
            <DropdownMenu.Item>Pages</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    },
    {
      name: "Collapsible",
      id: "collapsible",
      Component: (
        <Collapsible.Root
          open={collapsibleOpen}
          onOpenChange={setCollapsibleOpen}
        >
          <Collapsible.DefaultTrigger>Kumo 是什么？</Collapsible.DefaultTrigger>
          <Collapsible.DefaultPanel>
            <Text>Kumo 是 Cloudflare 的组件库。</Text>
          </Collapsible.DefaultPanel>
        </Collapsible.Root>
      ),
    },
    {
      name: "Checkbox",
      id: "checkbox",
      Component: (
        <Checkbox
          label="最大带宽"
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(checked);
          }}
        />
      ),
    },
    {
      name: "LayerCard",
      id: "layer-card",
      Component: (
        <LayerCard className="w-[200px]">
          <LayerCard.Secondary>后续步骤</LayerCard.Secondary>
          <LayerCard.Primary>你好</LayerCard.Primary>
        </LayerCard>
      ),
    },
    {
      name: "Loader",
      id: "loader",
      Component: <Loader />,
    },
    {
      name: "SkeletonLine",
      id: "skeleton-line",
      Component: (
        <div className="flex w-[200px] flex-col gap-2">
          <SkeletonLine minWidth={50} maxWidth={100} />
          <SkeletonLine minWidth={100} />
          <SkeletonLine minWidth={50} maxWidth={150} />
        </div>
      ),
    },
    {
      name: "CodeHighlighted",
      id: "code-highlighted",
      Component: (
        <ShikiProvider engine="javascript" languages={["typescript"]}>
          <CodeHighlighted
            lang="typescript"
            code={`const sum = (a: number, b: number) => {
  return a + b;
};`}
          />
        </ShikiProvider>
      ),
    },
    {
      name: "Banner",
      id: "banner",
      Component: (
        <div className="flex flex-col gap-2">
          <Banner description="这是一个默认横幅。" />
          <Banner
            icon={<WarningIcon weight="fill" />}
            title="这是一条警告横幅。"
            variant="alert"
          />
          <Banner
            icon={<WarningOctagonIcon weight="fill" />}
            title="这是一条错误横幅。"
            variant="error"
          />
        </div>
      ),
    },
    {
      name: "Tabs",
      id: "tabs",
      Component: (
        <Tabs
          tabs={[
            { value: "home", label: "首页" },
            { value: "about", label: "关于" },
            { value: "contact", label: "联系" },
          ]}
        />
      ),
    },
    {
      name: "Badge",
      id: "badge",
      Component: (
        <div className="flex flex-col gap-2">
          <Badge variant="blue">蓝色</Badge>
          <Badge variant="green">绿色</Badge>
          <Badge variant="orange">橙色</Badge>
          <Badge variant="neutral">中性</Badge>
          <Badge variant="red">红色</Badge>
        </div>
      ),
    },
    {
      name: "Toast",
      id: "toast",
      Component: (
        <Toasty>
          <ToastTriggerButton />
        </Toasty>
      ),
    },
    {
      name: "Pagination",
      id: "pagination",
      Component: (
        <Pagination
          page={paginationPage}
          perPage={10}
          totalCount={100}
          setPage={setPaginationPage}
          className="w-auto"
        >
          <Pagination.Controls />
        </Pagination>
      ),
    },
    {
      name: "InputArea",
      id: "input-area",
      Component: <InputArea placeholder="请输入你的姓名" />,
    },
    {
      name: "InputGroup",
      id: "input-group",
      Component: <InputGroupDemo />,
    },
    {
      name: "Meter",
      id: "meter",
      Component: (
        <Meter value={75} label="我的仪表" customValue="100 / 5,000" />
      ),
    },
    {
      name: "DatePicker",
      id: "date-picker",
      Component: (
        <div className="scale-85 bg-kumo-base p-4">
          <DatePicker mode="single" />
        </div>
      ),
    },
    {
      name: "Breadcrumbs",
      id: "breadcrumbs",
      Component: (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-kumo-subtle">首页</span>
          <span className="text-kumo-inactive">/</span>
          <span className="text-kumo-subtle">文档</span>
          <span className="text-kumo-inactive">/</span>
          <span className="font-medium">页面</span>
        </div>
      ),
    },
    {
      name: "ClipboardText",
      id: "clipboard-text",
      Component: <ClipboardText text="npx kumo add button" />,
    },
    {
      name: "CommandPalette",
      id: "command-palette",
      Component: <CommandPaletteBasicDemo />,
    },
    {
      name: "Flow",
      id: "flow",
      Component: (
        <Flow>
          <Flow.Node>步骤 1</Flow.Node>
          <Flow.Node>步骤 2</Flow.Node>
        </Flow>
      ),
    },
    {
      name: "Link",
      id: "link",
      Component: (
        <div className="flex flex-col gap-2 text-sm">
          <Link href="#">默认链接</Link>
          <Link href="#" variant="current">
            当前颜色链接
          </Link>
          <Link href="#" variant="plain">
            纯文本链接
          </Link>
        </div>
      ),
    },
    {
      name: "Empty",
      id: "empty",
      Component: (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-medium">暂无结果</span>
          <span className="text-xs text-kumo-subtle">
            请尝试其他搜索条件
          </span>
        </div>
      ),
    },
    {
      name: "Grid",
      id: "grid",
      Component: (
        <Grid variant="side-by-side" gap="sm" className="w-[140px]">
          <GridItem className="rounded bg-kumo-control p-3 text-center text-xs">
            1
          </GridItem>
          <GridItem className="rounded bg-kumo-control p-3 text-center text-xs">
            2
          </GridItem>
          <GridItem className="rounded bg-kumo-control p-3 text-center text-xs">
            3
          </GridItem>
          <GridItem className="rounded bg-kumo-control p-3 text-center text-xs">
            4
          </GridItem>
        </Grid>
      ),
    },
    {
      name: "Label",
      id: "label",
      Component: (
        <div className="flex flex-col gap-2">
          <Label>默认标签</Label>
          <Label showOptional>选填字段</Label>
          <Label tooltip="更多信息">带提示</Label>
        </div>
      ),
    },
    {
      name: "Popover",
      id: "popover",
      Component: (
        <Popover>
          <Popover.Trigger render={<Button />}>打开 Popover</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Popover 标题</Popover.Title>
            <Popover.Description>这是一个 Popover。</Popover.Description>
          </Popover.Content>
        </Popover>
      ),
    },
    {
      name: "Radio",
      id: "radio",
      Component: (
        <Radio.Group legend="选择选项" defaultValue="option1">
          <Radio.Item value="option1" label="选项 1" />
          <Radio.Item value="option2" label="选项 2" />
        </Radio.Group>
      ),
    },
    {
      name: "SensitiveInput",
      id: "sensitive-input",
      Component: <SensitiveInput value="super-secret-api-key" readOnly />,
    },
    {
      name: "Table",
      id: "table",
      Component: (
        <Table className="w-[200px] text-sm">
          <Table.Header>
            <Table.Row>
              <Table.Head>名称</Table.Head>
              <Table.Head>状态</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Worker 1</Table.Cell>
              <Table.Cell>活跃</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Worker 2</Table.Cell>
              <Table.Cell>已暂停</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Worker 3</Table.Cell>
              <Table.Cell>活跃</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      ),
    },
    {
      name: "TableOfContents",
      id: "table-of-contents",
      Component: (
        <TableOfContents>
          <TableOfContents.Title>本页目录</TableOfContents.Title>
          <TableOfContents.List>
            <TableOfContents.Item active>简介</TableOfContents.Item>
            <TableOfContents.Item>安装</TableOfContents.Item>
            <TableOfContents.Item>用法</TableOfContents.Item>
          </TableOfContents.List>
        </TableOfContents>
      ),
    },
    {
      name: "Text",
      id: "text",
      Component: (
        <div className="flex flex-col gap-1">
          <Text size="lg" bold>
            大号粗体文本
          </Text>
          <Text size="base">常规文本内容</Text>
          <Text size="sm" color="subtle">
            小号弱化文本
          </Text>
        </div>
      ),
    },
  ];

  return (
    <ul className="grid auto-rows-min grid-cols-1 gap-px bg-kumo-hairline md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {components.map((c) => {
        const route = componentRoutes[c.id] || null;
        return (
          <li
            className="relative flex aspect-square items-center justify-center bg-kumo-canvas"
            key={c.name}
          >
            {route ? (
              <a
                href={route}
                className="absolute top-4 left-4 text-base font-medium text-kumo-subtle hover:text-kumo-default"
              >
                {c.name}
              </a>
            ) : (
              <span className="absolute top-4 left-4 text-base font-medium text-kumo-subtle italic">
                {c.name}
              </span>
            )}
            <div className="flex w-full items-center justify-center p-8 leading-normal tracking-normal">
              {c.Component ?? (
                <p className="text-base font-medium text-kumo-subtle">TBD</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
