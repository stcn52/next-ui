# @stcn52/next-ui

A modern React component library built on **shadcn/ui v3**, **Tailwind CSS v4**, and **React 19**.

[简体中文文档](./README.zh-CN.md) | [中文更新日志](./CHANGELOG.zh-CN.md)

## Features

- 55+ components — buttons, forms, data tables, kanban boards, date pickers, and more
- **ConfigProvider** for global size (`sm` / `md` / `lg`), locale, and class prefix
- Built-in i18n with English, Chinese (zh-CN), and Japanese (ja-JP) — extensible via `registerLocale()`
- Advanced data patterns — virtual scrolling (100K+ rows), inline editing, URL state sync
- Drag & drop with dnd-kit (sortable lists and kanban boards)
- Form integration with react-hook-form + Zod validation
- Schema-driven form engine with rule links, derived values, repeatable groups, and custom widget registry support
- Keyboard shortcuts via react-hotkeys-hook
- Shared layout animations (Motion)
- Full Storybook documentation with interaction play tests
- Dark mode support via next-themes
- Chat-ready UI primitives: Bubble, BubbleList, ChatSender, ChatConversations, ThoughtChain
- Monaco-backed code workspace: file explorer, resizable editor, and sandbox preview in one compact shell

## Installation

```bash
npm install @stcn52/next-ui
# or
pnpm add @stcn52/next-ui
```

### Peer dependencies

```bash
pnpm add react react-dom tailwindcss
```

## Quick Start

```tsx
import { Button, ConfigProvider } from "@stcn52/next-ui"
import "@stcn52/next-ui/styles.css"

function App() {
  return (
    <ConfigProvider locale="zh-CN" size="md">
      <Button>Click me</Button>
    </ConfigProvider>
  )
}
```

## ConfigProvider

Wrap your app to set global defaults for size, locale, and class prefix:

```tsx
import { ConfigProvider } from "@stcn52/next-ui"

<ConfigProvider size="lg" locale="zh-CN">
  {/* All components inherit size="lg" and Chinese locale */}
</ConfigProvider>
```

### Schema Form Engine

`form-engine` can render schema-driven forms and let host apps register their own widgets:

```tsx
import { SchemaForm, createFieldWidgetRegistry, defineFieldWidget } from "@stcn52/next-ui"
import { ColorPicker } from "./color-picker"

const colorPickerWidget = defineFieldWidget(({ fieldApi, fieldProps, disabled }) => (
  <ColorPicker
    fieldProps={fieldProps}
    value={fieldApi.state.value as string}
    disabled={disabled}
    onChange={(next) => fieldApi.handleChange(next)}
  />
))

const widgets = createFieldWidgetRegistry({
  "color-picker": colorPickerWidget,
})

<SchemaForm schema={schema} widgets={widgets} onSubmit={console.log} />
```

`fieldProps` contains the label/error wiring that project components should forward to their real input controls.
`defineFieldWidget()` is optional, but it keeps widget definitions readable when you reuse them across forms.

In JSON schemas, custom widgets are declared with `widget` and serializable `widgetProps`:

```json
{
  "type": "input",
  "name": "brandColor",
  "label": "Brand color",
  "widget": "color-picker",
  "widgetProps": {
    "showPresets": true
  }
}
```

Time-based widgets follow the same pattern and keep schema values serializable:

```json
{
  "type": "input",
  "name": "launchAt",
  "label": "Launch window",
  "widget": "date-time-picker",
  "defaultValue": "2024-12-08T14:30:00",
  "widgetProps": {
    "hourCycle": 24,
    "placeholder": "Choose launch window"
  }
}
```

For time-only inputs, `time-picker` keeps values as `HH:mm` strings.

For upload workflows, keep `widgetProps` JSON-serializable and store runtime values as attachment metadata rather than raw `File` objects when you need to persist form state.

### Custom Locale

```tsx
import { registerLocale, ConfigProvider } from "@stcn52/next-ui"

registerLocale("ko-KR", {
  confirm: "확인",
  cancel: "취소",
  noResults: "결과가 없습니다.",
  // ... other keys
})

<ConfigProvider locale="ko-KR">...</ConfigProvider>
```

### Translation Hook

```tsx
import { useTranslation } from "@stcn52/next-ui"

function MyComponent() {
  const t = useTranslation()
  return <p>{t("rowsSelected", { count: 3, total: 10 })}</p>
  // → "3 of 10 row(s) selected."
}
```

## Components

| Category | Components |
|----------|-----------|
| **Layout** | Card, Separator, ResizablePanel, AspectRatio, ScrollArea, Sidebar |
| **Forms** | Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, InputOTP, Form (react-hook-form + Zod) |
| **Data** | DataTable, VirtualDataTable, UrlDataTable, EditableDataTable |
| **Feedback** | Alert, AlertDialog, Dialog, Drawer, Sheet, Sonner, Tooltip, Progress, Skeleton |
| **Navigation** | Breadcrumb, Tabs, NavigationMenu, Menubar, ContextMenu, DropdownMenu, Command |
| **Display** | Badge, Avatar, Carousel, HoverCard, Accordion, Collapsible, Toggle, ToggleGroup |
| **Advanced** | KanbanBoard, SortableList, DatePicker, Combobox, Shortcuts, AnimatedCard, CodeWorkspace |
| **Config** | ConfigProvider, ThemeProvider |
| **Hooks** | useKanbanStorage |

## Page Templates

Pre-built composite pages in Storybook demonstrating real-world component composition:

These page templates are for Storybook demos and project reference only. They are not part of the npm public API and should not be imported from the package entry.

| Page | Description |
|------|-------------|
| **Kanban** | Project management board with drag & drop (dnd-kit), collapsible sidebar, filter toolbar, localStorage persistence |
| **Dashboard** | Analytics overview with KPI cards, project table, activity feed |
| **Settings** | Tabbed settings with profile, notifications, appearance, security, language sections |
| **Auth** | Login, Register, Forgot Password forms with social login |
| **Error** | 404 Not Found, 500 Server Error, Maintenance pages |
| **Dark Mode** | Side-by-side light/dark mode comparison showcase |

## Key Component APIs

### Sidebar

```tsx
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem, SidebarFooter } from "@stcn52/next-ui"

<Sidebar collapsed={false} onCollapsedChange={setCollapsed}>
  <SidebarHeader>...</SidebarHeader>
  <SidebarContent>
    <SidebarItem active>Dashboard</SidebarItem>
    <SidebarItem>Settings</SidebarItem>
  </SidebarContent>
  <SidebarFooter>...</SidebarFooter>
</Sidebar>
```

### KanbanBoard

```tsx
import { KanbanBoard } from "@stcn52/next-ui"

<KanbanBoard
  columns={columns}
  onColumnsChange={setColumns}
  renderItem={(item) => <TaskCard task={item} />}
  renderColumnHeader={(col) => <ColumnHeader column={col} />}
  renderOverlay={(item) => <DragPreview item={item} />}
/>
```

### useKanbanStorage

```tsx
import { useKanbanStorage } from "@stcn52/next-ui"

const { columns, setColumns, resetColumns } = useKanbanStorage("my-board", initialColumns)
```

### ThemeProvider

```tsx
import { ThemeProvider, useTheme } from "@stcn52/next-ui"

<ThemeProvider preset="blue" radius={8}>
  <App />
</ThemeProvider>

// In a component:
const { setTokens, resetTokens, applyPreset, resolvedTheme } = useTheme()
```

## Testing

```bash
pnpm test         # Run Vitest unit tests (40 tests)
pnpm test:watch   # Watch mode
pnpm test:e2e     # Run Playwright E2E tests
pnpm perf:chat    # Run chat E2E benchmark (default 3 runs)
```

Performance benchmark options:

```bash
RUNS=5 pnpm perf:chat
BASELINE_SEC=3.2 FAIL_ABOVE_PCT=15 pnpm perf:chat
```

- `BASELINE_SEC`: baseline average seconds for comparison
- `FAIL_ABOVE_PCT`: allowed regression threshold (default `20`)

Unit tests cover Sidebar, KanbanBoard, drag interactions, and useKanbanStorage hook. E2E tests validate the Kanban page in a real Storybook environment.

## Release Checklist

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm publish:check
```

`publish:check` runs library build and npm dry-run packaging.

## Internationalization

Built-in locale files at `src/locales/`:

| Locale | File |
|--------|------|
| English | `en.json` |
| 简体中文 | `zh-CN.json` |
| 日本語 | `ja-JP.json` |

```tsx
import { ConfigProvider, useTranslation } from "@stcn52/next-ui"
import zhCN from "@stcn52/next-ui/locales/zh-CN.json"

<ConfigProvider locale={zhCN}>
  <App />
</ConfigProvider>

// In a component:
const { t } = useTranslation()
t("kanban.addTask") // "添加任务"
```

## CI/CD

GitHub Actions workflows:
1. [ci.yml](./.github/workflows/ci.yml) — runs lint, unit tests, library build, Storybook build, and Playwright E2E checks for `main` and pull requests
2. [storybook.yml](./.github/workflows/storybook.yml) — deploys Storybook to GitHub Pages on `main` when Pages is enabled
3. [publish.yml](./.github/workflows/publish.yml) — builds the library and publishes to npm on version tags or manual dispatch

## Development

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm storybook    # Storybook on port 6006
pnpm build        # Production build
pnpm build:lib    # Library build for npm
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm analyze      # Bundle visualization
```

## Migration Guide (0.2.x)

- Import package styles from `@stcn52/next-ui/styles.css`.
- Page templates in Storybook are demos only and are not public npm API exports.
- For chat interactions, prefer the reusable primitives in `ui`: `Bubble`, `ChatSender`, `ChatConversations`.

## FAQ

1. Why does `publish:check` run slowly?
It runs type generation (`vite:dts`) and npm dry-run packaging, so it is expected to be slower than plain build.

2. How do I benchmark chat E2E in CI?
Use `BASELINE_SEC` and `FAIL_ABOVE_PCT` to fail CI on regressions, for example:
`BASELINE_SEC=3.2 FAIL_ABOVE_PCT=15 pnpm perf:chat`.

## License

MIT
