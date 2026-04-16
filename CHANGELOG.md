# Changelog

## Unreleased

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
