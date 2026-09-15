import { useState, useEffect, useCallback, useMemo } from "react";
import { matchSorter } from "match-sorter";
import { CommandPalette, Badge, type HighlightRange } from "@cloudflare/kumo";
import {
  MagnifyingGlassIcon,
  CubeIcon,
  StackIcon,
  SquaresFourIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";

/**
 * Components in the registry that don't have Astro doc pages yet.
 * These are filtered out of search results until docs are written.
 *
 * To add a new component to search:
 * 1. Create the Astro doc page (e.g., /pages/components/my-component.astro)
 * 2. Remove it from this exclusion list
 * 3. Add its description to COMPONENT_DESCRIPTIONS below
 */
const COMPONENTS_WITHOUT_DOCS = new Set([
  "Code", // Deprecated: use CodeHighlighted from @cloudflare/kumo/code
  "CodeBlock", // Deprecated: use CodeHighlighted from @cloudflare/kumo/code
  "DateRangePicker", // Deprecated: use DatePicker with mode="range"
  "Field",
  "Icon",
  "MenuBar", // Deprecated; use Tabs with variant="segmented" instead
  "Surface", // Deprecated compatibility export; no dedicated docs page
]);

/**
 * Chart components are auto-discovered from the @cloudflare/kumo registry, but
 * they are documented under /charts/* rather than /components/*. Map the ones
 * with a dedicated page to their real docs URL so search results link correctly
 * — e.g. searching "bubble" finds BubbleMap and links to /charts/maps#bubble-map
 * instead of a non-existent /components/bubble-map. Components that share a page
 * (BubbleMap + ChoroplethMap live on /charts/maps) deep-link to their section
 * anchor so the result lands on the right content.
 */
const CHART_COMPONENT_URLS: Record<string, string> = {
  SankeyChart: "/charts/sankey",
  TimeseriesChart: "/charts/timeseries",
  BubbleMap: "/charts/maps#bubble-map",
  ChoroplethMap: "/charts/maps#choropleth-map",
  GlobeMap: "/charts/maps#cloudflare-availability-locations",
};

/**
 * Chart components with no dedicated page of their own — they're already
 * represented by curated STATIC_PAGES entries (the "Charts" overview and
 * "Custom Chart"), so we exclude the registry duplicates from search.
 * ChartLegend additionally has no Props type, so it isn't in the registry —
 * listed here for clarity/forward-proofing.
 */
const CHART_COMPONENTS_WITHOUT_OWN_PAGE = new Set(["Chart", "ChartLegend"]);

/**
 * Map registry component names to their doc page slugs.
 * Only needed when the name doesn't match the standard kebab-case conversion.
 */
const SLUG_OVERRIDES: Record<string, string> = {
  CodeHighlighted: "code-highlighted",
  DropdownMenu: "dropdown",
  Toasty: "toast",
};

/**
 * Static pages that should be included in search.
 * These are top-level documentation pages that aren't in the component registry.
 */
const STATIC_PAGES: Array<{
  name: string;
  description: string;
  url: string;
  category: string;
  type?: "component" | "block" | "layout" | "page";
}> = [
  {
    name: "安装",
    description: "如何在你的项目中安装并配置 Kumo。",
    url: "/installation",
    category: "快速上手",
  },
  {
    name: "参与贡献",
    description: "为 Kumo 组件库贡献代码的指南。",
    url: "/contributing",
    category: "快速上手",
  },
  {
    name: "无障碍",
    description: "Kumo 组件中的无障碍标准与最佳实践。",
    url: "/accessibility",
    category: "快速上手",
  },
  {
    name: "组件与区块",
    description: "理解组件与区块之间的区别。",
    url: "/components-vs-blocks",
    category: "快速上手",
  },
  {
    name: "颜色",
    description: "探索 Kumo 的语义化颜色令牌与主题系统。",
    url: "/colors",
    category: "指南",
  },
  {
    name: "图表",
    description: "基于 ECharts 构建的图表。",
    url: "/charts",
    category: "图表",
  },
  {
    name: "图表配色",
    description: "图表在语义、分类与连续配色方面的颜色指引。",
    url: "/charts/colors",
    category: "图表",
  },
  {
    name: "地图",
    description: "用于通过 GeoJSON 可视化地理数据的图表组件。",
    url: "/charts/maps",
    category: "图表",
  },
  {
    name: "自定义图表",
    description: "使用 Chart 组件的示例图表。",
    url: "/charts/custom",
    category: "图表",
  },
  {
    name: "CLI",
    description: "使用 Kumo CLI 向你的项目添加组件与区块。",
    url: "/cli",
    category: "指南",
  },
  {
    name: "流式渲染",
    description: "Kumo 中的服务端渲染与流式传输支持。",
    url: "/streaming",
    category: "指南",
  },
  {
    name: "Figma",
    description: "通过 Kumo Figma 插件在 Figma 中使用 Kumo 组件。",
    url: "/figma",
    category: "指南",
  },
  {
    name: "组件注册表",
    description: "浏览并探索完整的 Kumo 组件注册表。",
    url: "/registry",
    category: "指南",
  },
  {
    name: "CodeHighlighted",
    description: "由 Shiki 提供支持的语法高亮代码块。",
    url: "/components/code-highlighted",
    category: "组件",
    type: "component",
  },
  {
    name: "Flow",
    description: "用于可视化顺序与并行工作流的图表组件。",
    url: "/components/flow",
    category: "组件",
    type: "component",
  },
];

/** Better descriptions from the Astro doc pages */
const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  badge: "用于展示状态、分类或元数据的小型标签。",
  "command-palette": "以键盘驱动的命令菜单，用于搜索与导航。",
  meter: "在已知范围内展示数值的可视化指示器。",
  pagination: "分页内容的导航控件。",
  banner: "展示信息、警告或错误状态的情境内联消息。",
  button: "展示按钮或外观类似按钮的组件。",
  checkbox: "用于在选中与未选中之间切换的控件。",
  "clipboard-text": "带一键复制按钮的文本组件。",
  collapsible: "一组垂直堆叠的交互式标题，每个标题展开对应内容。",
  combobox: "可搜索的 Select 组件，用于过滤并从选项中选择。",
  dialog: "覆盖在主窗口或其他对话框之上的模态窗口。",
  dropdown: "由按钮触发的一组操作或功能菜单。",
  input: "内置标签、描述与错误提示的文本输入框。",
  "input-area": "用于较长内容的多行文本输入，内置标签、描述与错误提示。",
  label: "用于表单字段的标签组件，支持必填/选填标识。",
  "layer-card": "带分层视觉效果的卡片，用于导航或重点展示。",
  loader: "用于展示加载状态的加载动画。",
  popover: "锚定于触发元素的可访问弹层。",
  radio: "允许用户从一组选项中选择一个的控件。",
  select: "展示一组选项供用户选择的组件。",
  "sensitive-input": "用于 API 密钥、密码等敏感值的掩码输入。",
  "skeleton-line": "用于文本内容的骨架占位符。",
  switch: "可在开与关之间切换的双态按钮。",
  table: "用于展示表格数据并支持选择的表格组件。",
  tabs: "一次只显示一层内容的层级化内容区。",
  text: "用于各类标题与正文样式的排版组件。",
  tooltip: "在悬停或聚焦时展示信息的弹层。",
  breadcrumbs: "展示当前页面在导航层级中的位置。",
  empty: "用于空状态的占位组件，带插画与操作按钮。",
  "page-header": "组合面包屑与页签，用于页面导航。",
  "resource-list": "用于展示带标题与侧栏的资源列表布局。",
  toast: "短暂显示、轻量且不打扰用户的即时通知。",
};

/** Translate registry category names to Chinese for the search UI. */
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Action: "操作",
  "Data Visualization": "数据可视化",
  Display: "展示",
  Feedback: "反馈",
  Input: "输入",
  Layout: "布局",
  Navigation: "导航",
  Other: "其他",
  Overlay: "浮层",
  Block: "区块",
  "Getting Started": "快速上手",
  Guides: "指南",
  Charts: "图表",
  Components: "组件",
};

function translateCategory(category: string): string {
  return CATEGORY_TRANSLATIONS[category] || category;
}

interface ComponentRegistryEntry {
  name: string;
  type: "component" | "block" | "layout";
  description: string;
  category: string;
  props?: Record<string, unknown>;
}

interface ComponentRegistry {
  version: string;
  components: Record<string, ComponentRegistryEntry>;
}

interface SearchItem {
  name: string;
  type: "component" | "block" | "layout" | "page";
  description: string;
  category: string;
  url: string;
}

interface SearchGroup {
  label: string;
  items: SearchItem[];
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Build URL path from component type and name */
function getComponentUrl(type: string, name: string): string {
  // Chart components are documented under /charts/*, not /components/*.
  if (CHART_COMPONENT_URLS[name]) {
    return CHART_COMPONENT_URLS[name];
  }

  const slug =
    SLUG_OVERRIDES[name] ??
    name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  switch (type) {
    case "block":
      return `/blocks/${slug}`;
    case "layout":
      return `/layouts/${slug}`;
    default:
      return `/components/${slug}`;
  }
}

/** Get better description from mapping, falling back to registry */
function getDescription(name: string, registryDescription: string): string {
  const slug =
    SLUG_OVERRIDES[name] ??
    name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return COMPONENT_DESCRIPTIONS[slug] || registryDescription;
}

/** Find all matching ranges in text for a query (for highlighting) */
function findHighlightRanges(text: string, query: string): HighlightRange[] {
  if (!query.trim()) return [];

  const ranges: HighlightRange[] = [];
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  let startIndex = 0;
  while (true) {
    const index = textLower.indexOf(queryLower, startIndex);
    if (index === -1) break;
    // HighlightRange is [start, end] tuple (end is inclusive)
    ranges.push([index, index + queryLower.length - 1]);
    startIndex = index + 1;
  }

  return ranges;
}

/** Group items by category (used when browsing without a query) */
function groupByCategory(items: SearchItem[]): SearchGroup[] {
  const groups: Record<string, SearchItem[]> = {};

  for (const item of items) {
    const category = translateCategory(item.category || "Other");
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
  }

  // Define category order: Getting Started and Guides first, Block/Layout last
  const categoryOrder = (cat: string): number => {
    if (cat === "快速上手") return 0;
    if (cat === "指南") return 1;
    if (cat === "区块" || cat === "布局") return 100;
    return 50; // Component categories in the middle
  };

  const sortedCategories = Object.keys(groups).sort((a, b) => {
    const orderDiff = categoryOrder(a) - categoryOrder(b);
    if (orderDiff !== 0) return orderDiff;
    return a.localeCompare(b);
  });

  return sortedCategories.map((category) => ({
    label: category,
    items: groups[category],
  }));
}

/** Return items as a single "Results" group (used when searching) */
function asSearchResults(items: SearchItem[]): SearchGroup[] {
  if (items.length === 0) return [];
  return [{ label: "搜索结果", items }];
}

/** Get icon for item type */
function getTypeIcon(type: "component" | "block" | "layout" | "page") {
  switch (type) {
    case "block":
      return <StackIcon size={16} weight="duotone" />;
    case "layout":
      return <SquaresFourIcon size={16} weight="duotone" />;
    case "page":
      return <BookOpenIcon size={16} weight="duotone" />;
    default:
      return <CubeIcon size={16} weight="duotone" />;
  }
}

/** Get badge for item type (only shown when searching, not when grouped by category) */
function getTypeBadge(
  type: "component" | "block" | "layout" | "page",
  isSearching: boolean,
) {
  if (!isSearching) return null; // Don't show badge when grouped - category label is enough

  switch (type) {
    case "block":
      return <Badge variant="neutral">区块</Badge>;
    case "layout":
      return <Badge variant="neutral">布局</Badge>;
    case "page":
      return <Badge variant="neutral">指南</Badge>;
    default:
      return null;
  }
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [registry, setRegistry] = useState<ComponentRegistry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch component registry
  useEffect(() => {
    async function fetchRegistry() {
      try {
        setLoading(true);
        const response = await fetch("/api/component-registry");
        if (!response.ok) {
          throw new Error(`Failed to fetch registry: ${response.status}`);
        }
        const data = await response.json();
        setRegistry(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load component registry:", err);
        setError("搜索索引加载失败");
      } finally {
        setLoading(false);
      }
    }

    if (open && !registry) {
      void fetchRegistry();
    }
  }, [open, registry]);

  // Convert registry to searchable items and include static pages
  const allItems = useMemo<SearchItem[]>(() => {
    // Always include static pages
    const staticItems: SearchItem[] = STATIC_PAGES.map((page) => ({
      name: page.name,
      type: page.type ?? "page",
      description: page.description,
      category: page.category,
      url: page.url,
    }));

    if (!registry?.components) return staticItems;

    const componentItems = Object.values(registry.components)
      .filter(
        (component) =>
          !COMPONENTS_WITHOUT_DOCS.has(component.name) &&
          !CHART_COMPONENTS_WITHOUT_OWN_PAGE.has(component.name),
      )
      .map((component) => ({
        name: component.name,
        type: component.type,
        description: getDescription(component.name, component.description),
        category: component.category,
        url: getComponentUrl(component.type, component.name),
      }));

    return [...staticItems, ...componentItems];
  }, [registry]);

  // Filter and group items based on query using match-sorter
  const filteredGroups = useMemo<SearchGroup[]>(() => {
    if (!query.trim()) {
      return groupByCategory(allItems);
    }

    const filtered = matchSorter(allItems, query, {
      keys: [
        { key: "name", threshold: matchSorter.rankings.CONTAINS },
        { key: "description", threshold: matchSorter.rankings.CONTAINS },
        { key: "category", threshold: matchSorter.rankings.CONTAINS },
      ],
    });

    return asSearchResults(filtered);
  }, [allItems, query]);

  // Get flat list of all filtered items for keyboard navigation
  const getSelectableItems = useCallback(
    (groups: SearchGroup[]) => groups.flatMap((g) => g.items),
    [],
  );

  // Handle item selection
  const handleSelect = useCallback(
    (item: SearchItem, options: { newTab: boolean }) => {
      if (options.newTab) {
        window.open(item.url, "_blank");
      } else {
        window.location.href = item.url;
      }
      onOpenChange(false);
    },
    [onOpenChange],
  );

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const hasResults = filteredGroups.some((g) => g.items.length > 0);
  const totalResults = filteredGroups.reduce(
    (sum, g) => sum + g.items.length,
    0,
  );
  const isSearching = query.trim().length > 0;

  return (
    <CommandPalette.Root<SearchGroup, SearchItem>
      open={open}
      onOpenChange={onOpenChange}
      items={filteredGroups}
      value={query}
      onValueChange={setQuery}
      itemToStringValue={(group: SearchGroup) => group.label}
      onSelect={handleSelect}
      getSelectableItems={getSelectableItems}
      filter={() => true}
    >
      <CommandPalette.Input
        placeholder="搜索文档..."
        leading={
          <MagnifyingGlassIcon
            className="h-4 w-4 text-kumo-subtle"
            weight="bold"
          />
        }
      />
      <CommandPalette.List>
        {loading ? (
          <CommandPalette.Loading />
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-kumo-subtle">{error}</p>
          </div>
        ) : !hasResults ? (
          <CommandPalette.Empty>
            {query.trim()
              ? `未找到与「${query}」相关的结果`
              : "输入关键词搜索文档"}
          </CommandPalette.Empty>
        ) : (
          <CommandPalette.Results>
            {(group: SearchGroup) => (
              <CommandPalette.Group key={group.label} items={group.items}>
                <CommandPalette.GroupLabel>
                  {group.label}
                </CommandPalette.GroupLabel>
                <CommandPalette.Items>
                  {(item: SearchItem) => (
                    <CommandPalette.Item<SearchItem>
                      key={item.name}
                      value={item}
                      onClick={(e: React.MouseEvent) => {
                        const newTab = e.metaKey || e.ctrlKey;
                        handleSelect(item, { newTab });
                      }}
                    >
                      <div className="flex w-full items-center gap-3">
                        <div className="flex-shrink-0 text-kumo-subtle">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <CommandPalette.HighlightedText
                              text={item.name}
                              highlights={findHighlightRanges(item.name, query)}
                              className="text-base font-medium text-kumo-default"
                            />
                            {getTypeBadge(item.type, isSearching)}
                          </div>
                          <CommandPalette.HighlightedText
                            text={item.description}
                            highlights={findHighlightRanges(
                              item.description,
                              query,
                            )}
                            className="block truncate text-sm text-kumo-subtle"
                          />
                        </div>
                      </div>
                    </CommandPalette.Item>
                  )}
                </CommandPalette.Items>
              </CommandPalette.Group>
            )}
          </CommandPalette.Results>
        )}
      </CommandPalette.List>
      <CommandPalette.Footer>
        <span className="text-kumo-subtle">
          {hasResults
            ? `${totalResults} 条结果`
            : ""}
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-kumo-hairline bg-kumo-base px-1.5 py-0.5">
              ↑
            </kbd>
            <kbd className="rounded border border-kumo-hairline bg-kumo-base px-1.5 py-0.5">
              ↓
            </kbd>
            <span>选择</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-kumo-hairline bg-kumo-base px-1.5 py-0.5">
              ↵
            </kbd>
            <span>打开</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-kumo-hairline bg-kumo-base px-1.5 py-0.5">
              ⌘↵
            </kbd>
            <span>新标签页</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-kumo-hairline bg-kumo-base px-1.5 py-0.5">
              esc
            </kbd>
            <span>关闭</span>
          </span>
        </div>
      </CommandPalette.Footer>
    </CommandPalette.Root>
  );
}
