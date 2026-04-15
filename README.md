# @stcn52/next-ui

A modern React component library built on **shadcn/ui v3**, **Tailwind CSS v4**, and **React 19**.

## Features

- 55+ components — buttons, forms, data tables, kanban boards, date pickers, and more
- **ConfigProvider** for global size (`sm` / `md` / `lg`), locale, and class prefix
- Built-in i18n with English, Chinese (zh-CN), and Japanese (ja-JP) — extensible via `registerLocale()`
- Advanced data patterns — virtual scrolling (100K+ rows), inline editing, URL state sync
- Drag & drop with dnd-kit (sortable lists and kanban boards)
- Form integration with react-hook-form + Zod validation
- Keyboard shortcuts via react-hotkeys-hook
- Shared layout animations (Motion)
- Full Storybook documentation with interaction play tests
- Dark mode support via next-themes

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
| **Advanced** | KanbanBoard, SortableList, DatePicker, Combobox, Shortcuts, AnimatedCard |
| **Config** | ConfigProvider, ThemeProvider |
| **Hooks** | useKanbanStorage |

## Page Templates

Pre-built composite pages in Storybook demonstrating real-world component composition:

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
```

Unit tests cover Sidebar, KanbanBoard, drag interactions, and useKanbanStorage hook. E2E tests validate the Kanban page in a real Storybook environment.

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

## License

MIT
