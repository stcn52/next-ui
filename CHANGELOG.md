# Changelog

## 0.3.2 (2026-04-19)

### Fixes

- Restored the localized `FileManagerPage` implementation that `0.3.1` tests expected, including the search field, new-tab affordance, and updated table shell
- Restored localized `DateTimePicker` trigger and spinner labels so committed source matches the shipped locale dictionaries and test expectations

### Tests

- `pnpm lint`
- `pnpm test`
- `pnpm build:lib`

## 0.3.1 (2026-04-19)

### Improvements

- Localized chat primitives, prompt library surfaces, and file-manager stories through the shared `ConfigProvider` locale flow
- Added reusable chat i18n label builders so `ChatBubble`, `ChatConversations`, `ChatSender`, and related stories can switch locale without story-local string duplication
- Moved chat-page demo shell text, prompt-library chrome text, and relative conversation timestamps into locale dictionaries for `en`, `zh-CN`, and `ja-JP`
- Expanded localized Storybook coverage for chat, prompt-library, and file-manager stories with stronger play assertions on search, slash commands, attachments, and localized prompt application
- Added Playwright visual baselines for localized chat, file-manager, and prompt-library states

### Tests

- `pnpm lint`
- `pnpm test`
- `pnpm build:lib`
- Focused Playwright component visuals for localized chat, file-manager, and prompt-library stories

## 0.3.0 (2026-04-18)

### New Features

- Added a public schema-driven `form-engine` module built on TanStack Form
- Added schema rules, derived fields, field links, repeatable groups, JSON helpers, and a playground story
- Added widget registry helpers so host apps can bind custom controls into schema forms without forking library inputs

### Improvements

- Updated existing inputs such as ColorPicker, ChatSender, CommentEditor, Date/Time pickers, FileUpload, RichTextEditor, and several input primitives to accept shared form-engine field wiring
- Expanded `DataGrid` with copy, CSV export, reset-view controls, and steadier spreadsheet editing behavior

### Tests

- `pnpm exec vitest run src/__tests__/form-engine.test.ts src/__tests__/form-engine-render.test.tsx src/__tests__/form-engine-json.test.tsx`
- `pnpm exec vitest run src/__tests__/data-grid.test.tsx`

## 0.2.7 (2026-04-17)

### Fixes

- Tightened the compact UI baseline across chat, data, date, overlay, form, and file-upload surfaces to remove oversized chrome and wasted space

### Tests

- `pnpm lint`
- `pnpm test`
- `pnpm build:lib`
- `pnpm test:e2e`

## 0.2.6 (2026-04-17)

### Fixes

- Aligned the `data-grid-file-tree` E2E suite with the current Storybook story ids and component DOM structure

### Tests

- `pnpm test:e2e` now passes with the current DataTable and FileManager stories

## 0.2.5 (2026-04-17)

### Structural Improvements

- Components regrouped by domain under `src/components/ui` with updated barrel exports
- Root UI export now points at grouped barrels instead of the old flat file layout

### Fixes

- `Button` now supports `asChild`-style composition used by overlay triggers
- DataGrid column resize handling now uses the correct TanStack header API
- Date/time picker and multi-select trigger composition now matches Base UI typing
- `NumberInput` no longer collides with native input `size`
- `ColorPicker` submit and ARIA behavior was tightened for test and accessibility stability

### Tests

- Added and updated coverage for the refactor, including ColorPicker, SettingsPage, and DataGrid/FileTree flows

## 0.2.4 (2026-04-17)

### New Components

- **DateRangePicker** — 弹出式日期范围选择器，基于 react-day-picker `mode="range"` + `Popover`，支持 i18n（zh-CN / en / ja-JP）
- **FileUpload** — 拖拽上传区，支持拖拽放置、点击选择、文件列表、进度条、错误状态、大小限制

### New Page Templates (Stories)

- **ReportPage** — KPI 卡片 + 渠道表格 + 产品表格 + 过滤日期范围
- **OnboardingPage** — 4 步向导页，使用 Stepper，含资料表单 + 偏好开关

### Tests

- 新增 28 个单元测试（DateRangePicker 5 个 + FileUpload 23 个），总计 136 个测试

### compact-ui-review Audit

- **blog-page** — `space-y-6 p-6 → space-y-5 p-5`
- **pricing-page** — `mb-6 p-6 → mb-4 p-5`
- **chat-page welcome screen** — `gap-6 → gap-4`

### Improvements

**compact-ui-review audit sweep** — systematic spacing and color reduction across all page templates and composite components:

#### Page templates (story-level audits)
- **Notifications page** — replaced conditional `<Separator />` in 3 tabs with `divide-y divide-border` container (§9.2)
- **Projects page** — Separator between tags and footer → `border-t pt-2`; `space-y-4 → space-y-3` (§9.2)
- **Team page** — removed Separator before bordered invite section; `p-6 → p-4` invite; `py-5 → py-4` header (§9.2)
- **Orders page** — `py-5 → py-4` header; `space-y-6 p-6 → space-y-5 p-5`; `gap-4 → gap-3` KPI grid
- **Inbox page** — Separator `my-4 → my-3` (email subject/body divider)
- **FAQ page** — `py-6 → py-4` outer padding
- **Calendar page** — `gap-4 → gap-3` layout grid
- **Changelog page** — Separator `my-8 → my-6` (Timeline/footer gap)
- **Analytics page** — `p-6 → p-5 space-y-6 → space-y-5`; KPI `gap-4 → gap-3`; chart grid `gap-6 → gap-5`; Separator `my-4 → my-3`
- **Dashboard page** — `p-6 → p-5`; KPI `gap-4 → gap-3 mb-6 → mb-5`; Tabs `space-y-4 → space-y-3`
- **FileManager story** — `p-6 → p-5`; `gap/space-y-4 → gap/space-y-3`
- **UserList story** — `p-6 → p-5`; `gap-4 → gap-3`
- **Settings page** — subtitle `mb-6 → mb-4`; CardContent `space-y-4 → space-y-3` ×3; grid `gap-4 → gap-3`
- **Profile page** — Separator `my-6 → my-4`; CardContent `space-y-4 → space-y-3` ×2
- **Auth pages** — `space-y-4 → space-y-3`; grid `gap-4 → gap-3`
- **Blog page** — header `py-6 → py-4`; empty state `py-16 → py-8`
- **Pricing page** — section header `mb-8 → mb-6`
- **ThemeImport story** — `space-y-4 → space-y-3`; `gap-6 → gap-5` in preview grids

#### UI components (composite)
- **ChatBubble** `BubbleList` — `gap-4 → gap-3`
- **PromptLibrary** — root/content grid `gap-4 → gap-3`; variables `space-y-4 → space-y-3`
- **DataTable / VirtualDataTable / EditableDataTable** — empty cell `h-24 → h-16`; root `gap-4 → gap-3`
- **ChatCommandPalette / PromptLibrary** — various compact-ui-review O1–O3 improvements

#### Page components
- **FileManagerPage** (component) — `p-6 → p-5`; `gap-4 → gap-3`; empty cell `h-24 → h-16`
- **UserListPage** (component) — inactive status dot `bg-gray-300 → bg-border` (§11.4 dark mode fix)

#### SKILL.md updates (compact-ui-review)
- **v4** — §9 Spatial Design Principles (Apple HIG adaptation: 6 sub-principles)
- **v5** — §8 component-level spacing rules (MessageList, DataDisplay, PromptLibrary, Timeline, Kanban, Page chrome)
- **v6** — §10 Atomic Primitives guardrail (button/input/badge/card/alert/form all locked)
- **v7** — §11 Color & Dark Mode audit rules (semantic tokens, `dark:` patterns, story canvas exemption, grep patterns)



### Improvements

- **ChatSender compact refactor** — applied compact-ui-review (O1–O5):
  - `Card > CardContent` two-level wrapper replaced with a single `div` (same visual, one less DOM level)
  - Drag-over feedback text moved inside the card as an absolute overlay; root layout no longer expands on drag
  - Attachment item padding added to `densityStyles` map — compact/dense modes now correctly shrink attachment chips
  - Overlay suggestion panel title row ("快捷提示 / N 条") removed — redundant after clicking the trigger button
  - Lightbulb "快捷提示" button promoted from meta row to input row leading area; meta row `border-t` separator removed
  - Dead `metaButtonSize` key removed from all three density objects
- **ChatBubble compact refactor**:
  - Bubble padding `px-3.5 py-2.5` → `px-3 py-2` — matches industry standard (iMessage, Claude web)
  - Assistant messages widen from `max-w-[75%]` → `max-w-[85%]` to reduce code block overflow
  - Edit mode textarea `min-h-20` → `min-h-16` — less jarring height jump
  - Status/action row now skipped entirely when `timestamp`, sent status, and all actions are absent
- **Sidebar compact refactor**:
  - `SidebarHeader` / `SidebarFooter` vertical padding `py-3` → `py-2`
  - `SidebarGroup` vertical padding `py-2` → `py-1` — cuts ~44 px of inter-group dead space
  - `SidebarGroupLabel` padding `py-1.5` → `py-1`; `uppercase` removed (keeps `tracking-wider` for hierarchy)
  - `SidebarItem` padding `py-1.5` → `py-1` — 32 px touch target, meets WCAG 2.5.5 minimum
- **compact-ui-review skill** added to `.agents/skills/` for project-level reuse

---

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
- **ChatPresence** — online/offline/away/busy presence, typing/thinking, sent/delivered/read states
- **ChatCommandPalette** — slash-command palette with filtering, grouping, keyboard navigation, and sender attachment mode
- **PromptLibrary** — prompt template library with variable slots, rendered preview, and apply callback

### Improvements

- **React warning fixes** — resolved nested button issue in ThoughtChain and DropdownMenuTrigger
- **Test enhancements** — async state handling with `waitFor` in ChatConversations tests
- **E2E coverage** — 4 new Chat-specific E2E tests (sender, mentions, bubble variants, conversations)
- **ChatSender layout density** — `default` / `compact` / `dense` modes to preserve the input as the primary area
- **ChatSender space usage** — mentions and suggestions moved into overlays instead of pushing the composer downward
- **ChatSender toolbar controls** — `leadingActions`, `trailingActions`, `statusActions`, and attachment summary mode for tighter layouts
- **Test environment stability** — added jsdom polyfills for `ResizeObserver`, `scrollIntoView`, and `getAnimations`

### Tests

- Unit tests: 108 passing
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
