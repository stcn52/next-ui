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

### Page Shells
- Hero section: keep original padding — it sets visual tone
- Section header (icon + title + subtitle): `py-4` sufficient for non-hero
- Empty state: `py-8` + single line/icon is enough
- Single-group command palette heading: hide with `Object.keys(groups).length > 1 ? heading : undefined`
