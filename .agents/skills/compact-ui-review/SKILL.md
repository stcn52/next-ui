---
name: compact-ui-review
description: Review UI components, screens, and design systems for compactness, wasted space, visual noise, and interaction efficiency. Use when auditing layouts, cards, forms, toolbars, chat/composer surfaces, dashboards, or any component that feels oversized, empty, redundant, or low-density.
---

# Compact UI Review

## Purpose

Audit UI through a compact-refactoring lens: reduce visual noise, compress fixed space, and maximize the area that carries information or action.

## Review Flow

1. Identify the primary task.
2. Mark every region as `information`, `action`, `support`, or `decorative`.
3. Remove or merge any region that does not earn its space.
4. Compress fixed chrome before touching content.
5. Expand only when the extra space improves reading, selection, or control.

## Questions To Ask

- What does this space communicate or enable?
- Is this border, card, or gap solving a real problem?
- Can two rows become one row?
- Can low-frequency content be collapsed or deferred?
- Is the container stronger than the content?
- Would the UI still work if this padding were cut in half?

## Heuristics

- Prefer one dense action band over multiple loose sections.
- Use whitespace as structure, not decoration.
- Remove duplicate labels, headers, and helper text unless they change the decision.
- Keep recurring tools in a compact secondary row.
- Make default state dense; reveal detail on demand.

## Output

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
- whether the change is safe or risky

## Guardrail

Do not compact blindly. If reducing space harms scanability, touch target size, or error prevention, keep the space and explain why.
