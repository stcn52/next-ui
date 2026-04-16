# Changelog

## 0.2.1 (2026-04-16)

### New Features

- **Chat components** — reusable UI components for conversational interfaces
  - `Bubble` — message display with variants (filled/outlined/shadow/borderless)
  - `BubbleList` — scrollable message thread
  - `ChatSender` — input with attachments, @mentions, suggestions, loading state
  - `ChatConversations` — grouped conversation list with search
  - `ThoughtChain` — collapsible AI reasoning steps
  - `TypingIndicator` — animated "thinking" indicator
  - `RichContent` — markdown code block rendering

### Improvements

- **React warning fixes** — resolved nested button issue in ThoughtChain and DropdownMenuTrigger
- **Test enhancements** — async state handling with `waitFor` in ChatConversations tests
- **E2E coverage** — 4 new Chat-specific E2E tests (sender, mentions, bubble variants, conversations)

### Tests

- Unit tests: 88 passing (49 base + 39 Chat-related)
- E2E tests: 22 passing (18 Page compositions + 4 Chat-specific)
- All React warnings addressed

---

## 0.2.0 (2026-04-16)

### New Components

- **Timeline** — vertical/horizontal layout with dot variants (default/primary/success/warning/destructive) and connector lines
- **Stepper** — step indicator with horizontal/vertical orientation, completed/active/upcoming states

### New Page Templates

- **Blog** — featured post, tag filtering, article cards with reading time estimates
- **Landing** — hero section, feature grid, testimonials, CTA with install command
- **Team** — member management table, role badges (owner/admin/member/viewer), invite section
- **Inbox** — email-like thread list, preview pane, star/archive/delete actions
- **Projects** — card grid with progress bars, status badges, team avatars
- **Orders** — e-commerce table with KPI cards, status filters, order management

### Improvements

- **Theme CSS Import** — `parseThemeCSS()` to import themes from shadcnthemer.com
- **Sidebar a11y** — `aria-label`, `<nav>` element, `aria-current="page"` on active item
- **Global CSS** — `cursor: pointer` for interactive elements, `prefers-reduced-motion` support
- **Bundle optimization** — ESM 179KB (was 1,380KB), heavy deps externalized via regex patterns

### Tests

- Unit tests: 49 passing
- E2E tests: 16 passing (Playwright)
- Storybook play tests for all stories

---

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
