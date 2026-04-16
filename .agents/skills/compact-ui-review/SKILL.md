---
name: compact-ui-review
description: Review UI components, screens, and design systems for compactness, wasted space, visual noise, and interaction efficiency. Use when auditing layouts, cards, forms, toolbars, chat/composer surfaces, dashboards, or any component that feels oversized, empty, redundant, or low-density.
---

# Compact UI Review

> **Core rule:** do not compact blindly. Every change must pass the Guardrail test (§7).

---

## §1 — Pre-Audit Scan

Run before reading any component code. Grep for these patterns and flag immediately.

| Grep pattern | Flag? | Default action |
|---|---|---|
| `py-6` / `py-8` on page header (non-hero) | ✓ | → `py-4` |
| `py-16` on empty state | ✓ | → `py-8` |
| `mb-8` / `mb-10` on ≤2-line section header | ✓ | → `mb-6` |
| `space-y-4` inside `CardContent` (≥3 fields) | ✓ | → `space-y-3` |
| `gap-4` on side-by-side form grid | ✓ | → `gap-3` |
| `py-3` on `SidebarHeader` / `SidebarFooter` | ✓ | → `py-2` |
| `py-2` on `SidebarGroup` | ✓ | → `py-1` |
| `py-1.5` on `SidebarGroupLabel` or `SidebarItem` | ✓ | → `py-1` |
| `py-2` on conversation / list item | ✓ | → `py-1.5` |
| `p-3` on Kanban column | ✓ | → `p-2` |
| `gap-2` on Kanban card list | ✓ | → `gap-1.5` |
| `pb-8` on timeline item | ✓ | → `pb-6` |
| `px-3.5 py-2.5` on chat bubble | ✓ | → `px-3 py-2` |
| `uppercase` on sidebar group label | ✓ | remove |
| Single-group heading in Command/Palette | ✓ | hide with conditional |
| `<Separator />` between form subsections | check | remove if content separation is implied |
| Dedicated row for a single low-frequency icon | check | merge into adjacent action row |

---

## §2 — Classification

For every UI region, assign one label:

| Label | Description | Compression priority |
|---|---|---|
| `information` | Displays data the user reads | Low — don't cut content |
| `action` | Buttons, inputs, interactive elements | Low — protect touch targets |
| `support` | Labels, helper text, section headers | Medium — reduce if redundant |
| `decorative` | Dividers, gradients, empty space | High — first to cut |
| `chrome` | Page headers, nav, sidebars, footers | High — audit first |

---

## §3 — Audit Priority Order

Process in this order. Higher items give the most density gain per change.

1. **Page chrome** — header/footer `py-*`, top-level wrapper `p-*`
2. **Container padding** — Card, column, panel `p-*`
3. **Nav & sidebar** — group label spacing, item touch target, group gap
4. **Section gaps** — `space-y-*` and `gap-*` between content blocks
5. **Structural redundancy** — duplicate headings, separator between implied sections
6. **Individual elements** — button size, avatar size, icon size
7. **Content** — font size, line-height (touch last; highest readability risk)

---

## §4 — Decision Rules (If/Then)

Apply these mechanically. Skip only if Guardrail §7 says no.

```
IF region is a non-hero page header AND height > py-4 THEN compress to py-4
IF region is an empty state AND py > 8 THEN halve the py value
IF element is uppercase nav/sidebar label THEN remove uppercase; keep tracking-wider
IF CardContent contains ≥3 form field groups AND space-y-4 THEN → space-y-3
IF a heading appears when its group is the only group THEN hide heading with conditional
IF a Separator exists between form sections with no permission boundary THEN remove
IF a dedicated row holds exactly one low-frequency button THEN merge into adjacent row
IF Kanban column padding is p-3 THEN → p-2
IF timeline inter-item gap is pb-8 THEN → pb-6 (verify connector offset top-[30px] still valid)
IF chat bubble padding is px-3.5 py-2.5 THEN → px-3 py-2
```

---

## §5 — Tailwind Spacing Reference

Verified values from this project (Tailwind v4 / shadcn/ui v3):

| Context | Before | After | Notes |
|---|---|---|---|
| Page header (≤3 lines) | `py-6` | `py-4` | Section header, not hero |
| Section header margin | `mb-8` | `mb-6` | ≤2-line subtitle |
| Card / panel padding | `p-4` | `p-3` | Inner container |
| Chat bubble | `px-3.5 py-2.5` | `px-3 py-2` | Message content padding |
| Sidebar header / footer | `py-3` | `py-2` | Non-interactive chrome |
| Sidebar group container | `py-2` | `py-1` | Between groups |
| Sidebar group label | `py-1.5` | `py-1` | Remove `uppercase`; keep `tracking-wider` |
| Sidebar item | `py-1.5` | `py-1` | Maintains 32px touch target |
| Conversation list item | `py-2` | `py-1.5` | Side panel list |
| Form card body | `space-y-4` | `space-y-3` | ≥3 field groups |
| Side-by-side form grid | `gap-4` | `gap-3` | E.g., first/last name |
| Kanban column | `p-3` | `p-2` | Fixed-width column container |
| Kanban card list | `gap-2` | `gap-1.5` | Between sortable cards |
| Kanban column header | `mb-2` | `mb-1.5` | Header→list gap |
| Timeline item | `pb-8` | `pb-6` | Connector starts at `top-[30px]` — safe |
| Empty state | `py-16` | `py-8` | Short text ≠ tall container |
| Section separator | `<Separator />` | remove | Use `space-y-*` instead |

---

## §6 — Output Format

Return findings in this table, then an implementation list:

```markdown
## compact-ui-review — [ComponentName]

| ID | Region | Issue | Before | After | Severity |
|----|--------|-------|--------|-------|----------|
| O1 | Page header | Chrome over-padding | `py-6` | `py-4` | safe |
| O2 | CardContent | Form field gap | `space-y-4` | `space-y-3` | safe |
| O3 | SidebarGroupLabel | Uppercase noise | `uppercase tracking-wider` | `tracking-wider` | safe |
| O4 | EmptyState | Inflated padding | `py-16` | `py-8` | safe |

**Guardrail:** [pass / issues found: explain]

**Implementation plan:**
- O1: change `py-6` → `py-4` in `<header>` div on line N
- O2: change `CardContent className="space-y-4"` → `space-y-3` on line N
```

Severity values: `safe` · `moderate` (check Guardrail first) · `risky` (requires visual review after change).

---

## §7 — Guardrail

Do **not** apply a compression if it violates any of the following:

| Rule | Threshold | Why |
|---|---|---|
| Touch target | Drop below 32px height | WCAG 2.5.5; 24px is minimum, 32px is comfortable |
| List scanability | `gap-*` < 4px between rows | Eye can no longer parse row boundaries |
| Error prevention | Destructive actions, password inputs | Extra whitespace signals importance |
| Hierarchy signal | A featured/hero element must stay visually dominant | E.g., `h-32` cover on featured blog card |
| Connector geometry | Timeline/tree absolute connectors depend on offset | Verify `top-[Npx]` still aligns after `pb-*` change |
| Label readability | `uppercase` removal at `text-[10px]` | Tiny uppercase is often more readable; keep if < 11px |

When in doubt: **compress the chrome (outer containers), not the content.**

---

## §8 — Component Quick Reference

### Forms (login, register, settings)
- `CardContent space-y-4` → `space-y-3` when ≥3 field groups
- `grid-cols-2 gap-4` (side-by-side fields) → `gap-3`
- Remove `<Separator />` between form sections unless marking a permission boundary
- Field label→input `space-y-2`: keep — critical for label–control proximity

### Sidebar / Navigation
- Group label: remove `uppercase`; `text-xs font-medium tracking-wider` is sufficient
- Item: `py-1` floor (32px touch height = line-height ~1.25rem + 2×8px)
- Header / Footer: `py-2` unless they contain interactive controls
- Group container: `py-1` — pure visual gap, not a touch target

### Cards
- Inner container `p-3` is sufficient (vs shadcn default `p-6`)
- If Card wraps only label + paragraph: replace with plain `div` + own padding
- CardHeader has built-in row gap; avoid extra `mb-*` below it

### Chat / Composer
- Drag-over overlay: `absolute inset-0` — do not expand the card
- Overlay suggestion panel header: remove if content is self-describing
- Low-frequency buttons: merge into adjacent input row, not standalone rows

### Message / Bubble List
- `BubbleList` container: `gap-3` (not `gap-4`); bubbles are already self-enclosed
- Between email subject and body: `Separator my-3` (keep — true content boundary)
- Reply / action bar: `gap-2` between icon buttons

### Data Display (Tables, Lists)
- Empty state cell: `h-16` (vs default `h-24`) — large empty area wastes scroll space
- Root flex/grid wrapper: `gap-3` (not `gap-4`) for toolbar+table+pagination stacks
- Row cell padding: keep `px-4 py-2`; scanability threshold ≥4px row gap

### Prompt Library
- Two-panel layout grid: `gap-3` between sidebar panel and content panel
- Variable list inside panel: `space-y-3` (not `space-y-4`)
- Empty list placeholder: `py-6` acceptable (content empty state, not page chrome)

### Timeline / Stepper
- `TimelineItem` horizontal layout: `gap-4` — keep (icon + content column; tighter breaks alignment)
- Connector line depends on `pb-6` per item; do not reduce without verifying `top-[Npx]` offset
- Stepper horizontal: `gap-4` — keep (step circle + label; 12px is minimum for readability)

### Kanban
- Column-to-column gap: `gap-4` — keep (16px; cards inside columns need breathing room relative to lanes)
- Card internal padding: `p-3` preferred over `p-4`

### Page-level Chrome Rules (story pages)
- Page header (`border-b`): `py-4` ceiling (not `py-5` or `py-6`)
- Page body wrapper: `p-5` (not `p-6`); `space-y-5` (not `space-y-6`) for major sections
- KPI/stat grid: `gap-3` (not `gap-4`)
- `<Separator my-8>` between major sections → `my-6`; between title/body → `my-3`
- FAQ / Docs outer padding: `py-4` (not `py-6`)
- Changelog footer divider: `my-6` sufficient

### Page Shells
- Hero section: keep original padding — it sets visual tone
- Section header (icon + title + subtitle): `py-4` sufficient for non-hero
- Empty state: `py-8` + single line/icon is enough
- Single-group command palette heading: hide with `Object.keys(groups).length > 1 ? heading : undefined`

---

## §9 — Spatial Design Principles (Apple HIG-aligned)

The following principles are adapted from Apple's Human Interface Guidelines (Layout + Spatial Layout) and translated to React/Tailwind web context.

### 9.1 Minimum Sufficient Immersion

> "Find the minimum level of immersion that suits each key moment — don't assume every moment needs to be fully immersive."
> — Apple HIG, Designing for visionOS

**Web translation:** Use the minimum amount of UI decoration (borders, cards, separators, padding) that communicates the required hierarchy. Every `<Card>`, `<Separator />`, or nested container must justify its presence.

**Check list:**
- Is this `Card` wrapping a single plain paragraph? → Replace with `div` + padding.
- Is this `<Separator />` between two sections that are already visually distinct by heading? → Remove it.
- Is this `p-6` on a container that already has a border? → Reduce to `p-3` or `p-4`.

### 9.2 Elevation Over Margin

> "Use depth to communicate hierarchy... you don't need to use it everywhere."
> — Apple HIG, Spatial Layout

**Web translation:** Before adding `mb-4`, `py-6`, or `<Separator />` to separate two sections, ask if a visual elevation signal can do the same job with less space:

| Separation method | Space cost | Recommended when |
|---|---|---|
| `space-y-*` / `gap-*` | medium | Flow items in a list |
| `<Separator />` | low (1px) + high (margin) | True content boundary with `my-2` |
| Background tint `bg-muted/30` | zero | Group related form fields |
| Shadow `shadow-sm` | zero | Elevate action card from content |
| Border `rounded-lg border` | zero | Distinguish items without gap |

**Rule:** If the only way you're separating two sections is with margin/padding, first ask if a border, background tint, or card elevation would do it with less space.

### 9.3 Space as Signal, Not Filler

> "Make essential information easy to find by giving it sufficient space. Don't obscure it by crowding it with nonessential details."
> — Apple HIG, Layout

**Web translation:** Whitespace should **explain relationships**, not fill empty area by default. This has two sides:

- ✓ **Preserve** space between dissimilar items (form field group → submit button: keep `space-y-4`)
- ✗ **Remove** space between similar items that are already distinguished by border or icon (nav items: `py-1` not `py-1.5`; conversation items: `py-1.5` not `py-2`)

### 9.4 Cognitive Refocus Cost

> "People need to refocus their eyes to perceive each difference in depth, and doing so too often or quickly can be tiring."
> — Apple HIG, Spatial Layout (Depth)

**Web translation:** Multiple distinct spacing levels within a small area increase cognitive load. Aim for **≤2 spacing scales** within any single component:

| Anti-pattern | Better |
|---|---|
| `p-6 → CardHeader (pb-6) → space-y-4 → space-y-2` | `p-4 → CardHeader (pb-4) → space-y-3 → space-y-2` |
| `py-8 section + py-4 card + py-3 item + py-2 sub-item` | Flatten to 2 levels max |

### 9.5 Constrained-Width Efficiency (watchOS principle)

> "To avoid wasting valuable space, consider minimizing the padding between elements."
> — Apple HIG, Layout (watchOS)

**Web translation:** In narrow contexts (sidebar ≤240px, chat panel ≤320px, mobile), padding is proportionally more expensive. Apply stricter compression:

| Context | Outer padding | Item padding |
|---|---|---|
| Full-page (`max-w-4xl`) | `p-6` acceptable | `p-4` acceptable |
| Panel / drawer (`w-64`–`w-80`) | `px-3 py-2` | `py-1` |
| Sidebar nav (`w-56`–`w-64`) | `px-2 py-1` | `py-1` |
| Chat input / composer | `p-2` or `p-3` | dense mode only |

### 9.6 Controls Must Have Visual Affordance

> "Differentiate controls from content."
> — Apple HIG, Layout (Visual hierarchy)

**Web translation:** If an interactive element is only separated from content by whitespace (no border, no background, no shadow), the whitespace is carrying the entire affordance burden. This is fragile. Instead:
- Use `border` or `bg-accent` on toggle row items → reduces need for `py-3` gap
- Use `rounded-md` with `hover:bg-accent` on nav items → reduces need for `py-2`
- Use `shadow-sm` on action cards → reduces need for large `space-y-*` separation

When visual affordance is strong, spacing can be reduced safely.

### §10 — Atomic Primitives Audit Guardrail

**Do not audit** internal padding/gap of shadcn primitives (button, input, badge, select, etc.).
These are intentionally sized for WCAG touch targets and text alignment.

| Component | Key sizes | Status |
|---|---|---|
| `button` | `h-6/7/8/9`, `px-2`–`px-2.5` | Locked |
| `input` | `h-7/8/9`, `px-2`–`px-3`, `py-1` | Locked |
| `badge` | `h-4/5/6`, proportional `px`/`py` | Locked |
| `card` | `gap-4` + `data-[size=sm]:gap-3` | Locked (responsive) |
| `alert` | `px-2.5 py-2` | Locked |
| `form` | field wrapper `gap-2` | Locked (label–input proximity) |

**Only audit** composite components and page-level wrappers that use these primitives.

---

## §11 — Color & Dark Mode Audit Rules

### 11.1 Use Semantic Tokens, Not Raw Colors

The project uses CSS variable–based color tokens. Any hardcoded color is a smell unless intentional.

| Pattern | Verdict | Action |
|---|---|---|
| `bg-gray-100`, `text-gray-500` | ❌ Forbidden in components | Replace with `bg-muted`, `text-muted-foreground` |
| `bg-zinc-950 text-zinc-50` (code block) | ✓ Intentional | Keep — code blocks are always dark |
| `bg-background text-foreground` | ✓ Correct | Semantic root colors |
| `bg-card text-card-foreground` | ✓ Correct | Card surface |
| `bg-muted/30`, `bg-muted/50` | ✓ Correct | Tinted section backgrounds |
| `border-input`, `ring-ring/50` | ✓ Correct | Input and focus ring tokens |

### 11.2 Dark Mode via `dark:` Modifier

`dark:` classes are **only needed** when a semantic CSS variable cannot achieve the dark variant automatically. Most shadcn primitives handle dark mode via CSS variables — do not add redundant `dark:` overrides.

**Allowed** `dark:` patterns (verified in codebase):
- `dark:bg-input/30` — slightly transparent input bg in dark mode
- `dark:hover:bg-muted/50` — lighter hover surface in dark mode  
- `dark:aria-invalid:ring-destructive/40` — error ring needs different opacity in dark
- `dark:data-[variant=destructive]:focus:bg-destructive/20` — contextual dark interaction

**Anti-pattern to flag:**
- `dark:text-gray-400` → replace with `dark:text-muted-foreground`
- `dark:bg-gray-800` → replace with `dark:bg-card` or `dark:bg-input/30`
- Adding `dark:` when a CSS variable already handles it

### 11.3 Story-Level Dark Mode Wrappers

Story canvases often use `p-6 bg-gray-100` or similar as Storybook story padding. This is acceptable for story isolation and should not be flagged as a spacing issue.

| Context | Verdict |
|---|---|
| `class="p-6 bg-gray-100"` on story canvas root | ✓ Acceptable (Storybook only) |
| `class="bg-gray-100"` inside a component | ❌ Flag — use `bg-muted` |

### 11.4 Color Audit Grep Patterns

```
bg-gray-\|text-gray-\|border-gray-   →  semantic token audit
dark:bg-gray\|dark:text-gray         →  dark: raw color audit
bg-zinc-\|text-zinc-                 →  intentional only if code block
```

---

## §12 — Motion & Animation Audit Rules

### 12.1 Transition Duration

All interactive transitions should be **purposeful and brief**. Overly long transitions add perceived latency.

| Pattern | Target duration | Reason |
|---|---|---|
| Hover background / text color | `duration-100` to `duration-150` | Immediate feedback |
| Popover / tooltip open/close | `duration-100` to `duration-200` | Responsive to intent |
| Navigation menu slide (complex) | `duration-300` to `duration-350` | Spatial orientation |
| Page routing / full-screen | `duration-200` to `duration-300` | Context switch signal |

**Audit flags:**
- `duration-500` or above on hover → reduce to `duration-150`
- `duration-1000` on any interactive element → **must fix**
- Missing `transition-*` on interactive element with visible state change → add `transition-colors` or `transition-all`

### 12.2 Easing

| Use case | Recommended easing |
|---|---|
| Open / enter from off-screen | `ease-[cubic-bezier(0.22,1,0.36,1)]` (spring-like) |
| Close / fade out | `ease-in` or `duration-150 ease-in` |
| Hover color change | `ease-in-out` (default Tailwind `transition`) |
| Bounce or spring emphasis | `[cubic-bezier(0.34,1.56,0.64,1)]` |

### 12.3 Animations Guardrail

- **Do not add** `animate-spin` / `animate-bounce` to decorative elements — motion without meaning increases cognitive load
- **Preserve** `animate-in / animate-out` on shadcn overlay components (popover, dialog, sheet) — these are intentional UX affordances
- **Respect** `prefers-reduced-motion` via Tailwind's `motion-reduce:` prefix on any new animation

### 12.4 Animation Audit Grep

```
duration-[5-9][0-9][0-9]\|duration-1[0-9]{3}  →  flag overly long transitions
animate-spin\|animate-bounce                    →  verify decorative use
transition-all                                  →  consider replacing with transition-colors or transition-transform (more specific)
```

---

## §13 — Responsive Design Spacing Rules

### 13.1 Mobile-First Principle

All spacing in this codebase uses Tailwind's **mobile-first** breakpoints (`sm:`, `md:`, `lg:`). Default (no prefix) = mobile.

| Context | Mobile (default) | Tablet (`md:`) | Desktop (`lg:`) |
|---|---|---|---|
| Page outer padding | `px-4 py-3` | `px-6 py-4` | `px-6 py-5` |
| KPI / stat grid | `grid-cols-1 gap-2` | `grid-cols-2 gap-3` | `grid-cols-4 gap-3` |
| Two-panel layout | `grid-cols-1 gap-3` | — | `grid-cols-[280px_1fr] gap-3` |
| Card inner padding | `p-3` | `p-3` | `p-4` |
| Sidebar width | full-screen or drawer | — | `w-64` fixed |

### 13.2 Audit for Non-Responsive Spacing

Flag these patterns when they appear **without breakpoint prefix** in a full-page component:

```
p-6       →  should be sm:p-5 or p-4 sm:p-5 lg:p-6
gap-4     →  should be gap-3 sm:gap-4 (in wide grids)
space-y-6 →  should be space-y-4 sm:space-y-6 (in full page layouts)
```

### 13.3 Touch-Specific Rules (Mobile)

- Minimum touch target: **44×44px** on mobile (Apple HIG / WCAG 2.5.5)
- On mobile, `py-1` sidebar items are acceptable if the sidebar is a full-screen drawer (hits target via full-width)
- `gap-2` between tappable items is acceptable if items have their own internal padding
- Avoid `gap-1` between icon-only buttons on mobile — merge into a toolbar or add explicit `min-w-11`

### 13.4 Responsive Spacing Grep

```
<main className="p-6   →  check if mobile has sufficient padding
grid-cols-4            →  verify if grid collapses on mobile
w-64 flex-row          →  sidebar fixed width, may need drawer on mobile
```
