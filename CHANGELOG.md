# Changelog

## 0.1.0 (2026-04-16)

### Features

- **55+ components** based on shadcn/ui v3 + Base UI + Tailwind CSS v4
- **ConfigProvider** — global size (`sm`/`md`/`lg`), locale, and class prefix
- **i18n** — built-in English, Chinese (zh-CN), Japanese (ja-JP) locales
  - `registerLocale()` for custom locales
  - `useTranslation()` hook with template interpolation (`formatMessage`)
  - All custom components (DataTable, DatePicker, Combobox, Kanban, etc.) are locale-aware
- **DataTable** — sorting, filtering, pagination, row selection (TanStack Table)
- **VirtualDataTable** — virtual scrolling for 100K+ rows (TanStack Virtual)
- **EditableDataTable** — inline cell editing with click-to-edit
- **UrlDataTable** — DataTable with URL parameter sync for filters/pagination
- **KanbanBoard** — cross-column drag & drop (dnd-kit multi-container)
- **SortableList** — drag-to-reorder list (dnd-kit)
- **DatePicker** — popover calendar composition (react-day-picker)
- **Combobox** — searchable select with command palette (cmdk)
- **Form** — react-hook-form + Zod validation integration
- **Shortcuts** — keyboard shortcuts display (react-hotkeys-hook)
- **AnimatedCard** — shared layout transition animations (Motion)
- **Dark mode** via ThemeProvider (next-themes)
- **Storybook 10** documentation with interaction play tests for all stories
- **Accessibility** — aria-labels, keyboard navigation, screen reader support
- **Size-aware components** — Button, Input, Badge, Select, Textarea respond to ConfigProvider size
