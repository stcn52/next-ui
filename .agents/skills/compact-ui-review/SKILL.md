---
name: compact-ui-review
description: Review UI components, screens, and design systems for compactness, wasted space, visual noise, and interaction efficiency. Use when auditing layouts, cards, forms, toolbars, chat/composer surfaces, dashboards, or any component that feels oversized, empty, redundant, or low-density.
---

# Compact UI Review

## Purpose

Audit UI through a compact-refactoring lens: reduce visual noise, compress fixed space, and maximize the area that carries information or action.

**Core rule:** do not compact blindly. Every compression decision must pass the Guardrail test below.

---

## Review Flow

1. Identify the **primary task** the component serves.
2. Mark every region as `information`, `action`, `support`, or `decorative`.
3. Score each region: *does this region earn its space relative to its classification?*
4. Compress **chrome first** (page headers, nav, containers) before touching content.
5. Expand only when extra space genuinely improves reading, selection, or error prevention.

---

## Audit Priority Order

Audit in this order — higher items give more density gain per change:

1. **Page chrome** — header/footer padding, top-level wrapper py/px
2. **Container padding** — Card, column, panel p-* values
3. **Nav & sidebar** — group label, item touch target, group gap
4. **Section gaps** — space-y-* and gap-* between content blocks
5. **Individual elements** — button size, badge, avatar, icon sizing
6. **Content** — font size, line height, text density (touch last; highest risk)

---

## Questions To Ask

- What does this space communicate or enable?
- Is this border, card, or gap solving a real problem?
- Can two rows become one row?
- Can low-frequency content be collapsed or deferred?
- Is the container stronger than the content?
- Would the UI still work if this padding were cut in half?
- Is this `uppercase` label truly necessary, or is it just adding visual mass?
- Is this group/section heading visible when there is only one group?

---

## Heuristics

- Prefer one dense action band over multiple loose sections.
- Use whitespace as structure, not decoration.
- Remove duplicate labels, headers, and helper text unless they change the decision.
- Keep recurring tools in a compact secondary row.
- Make default state dense; reveal detail on demand.
- Remove `uppercase` from small nav/section labels by default — `font-medium` and `tracking-wider` are sufficient.
- Hide single-group headings when the group name is redundant with the panel title.
- Move low-frequency controls (e.g., lightbulb/tip buttons) into adjacent action rows rather than creating dedicated rows.
- Empty state containers with `py-16` or larger should be halved — short text does not need 64px breathing room.

---

## Tailwind Spacing Reference (Tailwind v4 / compressed scale)

Apply these as defaults unless Guardrail says otherwise:

| Context | Before | After | Notes |
|---------|--------|-------|-------|
| Page header (≤3 lines) | `py-6` | `py-4` | Section header, not hero |
| Card / panel padding | `p-4` | `p-3` | Inner container |
| Sidebar / nav item | `py-1.5` | `py-1` | Maintains 32px touch target |
| Sidebar group label | `py-1.5` | `py-1` | Remove `uppercase`; keep `tracking-wider` |
| Sidebar header / footer | `py-3` | `py-2` | Non-interactive chrome |
| Nav group gap | `py-2` | `py-1` | Group container, not touch zone |
| Form card body | `space-y-4` | `space-y-3` | Field groups in login/register/settings |
| Field label → input | `space-y-2` | keep | Preserve label–control proximity |
| Kanban column | `p-3` | `p-2` | Fixed-width column container |
| Kanban card list | `gap-2` | `gap-1.5` | Between sortable cards |
| Timeline item | `pb-8` | `pb-6` | Connector alignment still valid at 24px |
| Conversation item | `py-2` | `py-1.5` | List item in sidebar panel |
| Chat bubble | `px-3.5 py-2.5` | `px-3 py-2` | Message content padding |
| Empty state | `py-16` | `py-8` | Cut in half; short text ≠ tall container |
| Section separator | `<Separator />` | remove if implicit | Use `space-y-*` instead |

---

## Component Watchlist (Known Patterns)

### Forms
- `CardContent space-y-4` → `space-y-3` when >3 field groups
- `grid grid-cols-2 gap-4` (side-by-side fields) → `gap-3`
- Remove decorative `<Separator />` between form subsections unless it marks a distinct permission boundary

### Sidebar / Navigation
- Group label: remove `uppercase`; `tracking-wider text-xs font-medium` is readable
- Item: `py-1` floor (32px touch height with default line height)
- Header/Footer: `py-2` unless they contain complex controls
- Group container: `py-1` between groups is sufficient visual separation

### Cards
- Inner panel `p-3` is usually enough (vs shadcn default `p-6`)
- CardHeader already has built-in spacing; avoid adding `mb-4` below it
- If only label + body inside, a plain `div` + `p-3` outperforms `Card + CardContent`

### Chat / Composer
- Drag-over overlay: use `absolute inset-0` rather than expanding the card
- Suggestion overlays: remove redundant header row; title bar adds nothing when content is already context-aware
- Action buttons: merge into adjacent input row when frequency is ≤1 per session

### Page Shells
- Hero section: keep original height — it sets visual tone
- Section header with icon + title + subtitle: `py-4` is sufficient; `py-6` is for hero-level prominence
- Empty state: `py-8` + single line or icon is enough for feedback

---

## Output Format

Return findings in this order:

1. Wasted space
2. Redundant structure
3. Visual noise
4. Low-density content
5. Missing compactness opportunities

For each finding, state:
- what is wasting space
- why it hurts
- what to collapse, merge, or remove
- whether the change is **safe** or **risky**
- the exact Tailwind class change

---

## Guardrail

Do not compact blindly. Keep space and explain why when:

- **Touch target** drops below 32px height (WCAG 2.5.5 minimum = 24px, comfortable = 32px)
- **Scanability** degrades: list items need ≥4px between them for the eye to parse rows
- **Error prevention**: password fields, destructive actions, and form submit buttons benefit from extra visual weight
- **Hierarchy signal**: a featured/hero element must remain visually dominant over list items
- **Connector geometry**: removing spacing from timeline or tree items invalidates absolute-positioned connectors — verify offsets before reducing

When in doubt: compress the chrome (outer containers), not the content.

