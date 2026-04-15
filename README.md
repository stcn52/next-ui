# @chenyang/ui

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
npm install @chenyang/ui
# or
pnpm add @chenyang/ui
```

### Peer dependencies

```bash
pnpm add react react-dom tailwindcss
```

## Quick Start

```tsx
import { Button, ConfigProvider } from "@chenyang/ui"
import "@chenyang/ui/styles.css"

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
import { ConfigProvider } from "@chenyang/ui"

<ConfigProvider size="lg" locale="zh-CN">
  {/* All components inherit size="lg" and Chinese locale */}
</ConfigProvider>
```

### Custom Locale

```tsx
import { registerLocale, ConfigProvider } from "@chenyang/ui"

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
import { useTranslation } from "@chenyang/ui"

function MyComponent() {
  const t = useTranslation()
  return <p>{t("rowsSelected", { count: 3, total: 10 })}</p>
  // → "3 of 10 row(s) selected."
}
```

## Components

| Category | Components |
|----------|-----------|
| **Layout** | Card, Separator, ResizablePanel, AspectRatio, ScrollArea |
| **Forms** | Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, InputOTP, Form (react-hook-form + Zod) |
| **Data** | DataTable, VirtualDataTable, UrlDataTable, EditableDataTable |
| **Feedback** | Alert, AlertDialog, Dialog, Drawer, Sheet, Sonner, Tooltip, Progress, Skeleton |
| **Navigation** | Breadcrumb, Tabs, NavigationMenu, Menubar, ContextMenu, DropdownMenu, Command |
| **Display** | Badge, Avatar, Carousel, HoverCard, Accordion, Collapsible, Toggle, ToggleGroup |
| **Advanced** | KanbanBoard, SortableList, DatePicker, Combobox, Shortcuts, AnimatedCard |
| **Config** | ConfigProvider, ThemeProvider |

## Development

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm storybook    # Storybook on port 6006
pnpm build        # Production build
pnpm build:lib    # Library build for npm
```

## License

MIT
