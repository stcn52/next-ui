---
name: antd-refactor-audit
description: Refactors and audits React UI components, pages, and design-system primitives against this workspace's Ant Design standard in docs/antd. Use when asked to migrate components, align spacing/typography/sizes/layouts, review visual consistency, audit Ant Design compliance, or upgrade existing UI to the new design standard.
---

# Ant Design Refactor Audit

Use this skill when the task is to refactor, migrate, normalize, or review UI against the workspace Ant Design standard under `docs/antd/`.

## Source Map

Read only the docs needed for the task:

- `docs/antd/QUICK_MIGRATION_GUIDE.md`
  Use first for component-level size migrations and fast delta checks.
- `docs/antd/ANTD_COMPONENT_SIZES.md`
  Use for exact component heights, paddings, font sizes, and radius targets.
- `docs/antd/ANTD_QUICK_REFERENCE.md`
  Use for spacing, control heights, radius, and semantic color tokens.
- `docs/antd/ANTD_PATTERNS_TEMPLATES.md`
  Use for buttons, forms, lists, empty states, copywriting, page templates, and action placement.
- `docs/antd/ANTD_TYPOGRAPHY_ICON_MOTION.md`
  Use for typography, icon sizing/usage, motion timing, and contrast requirements.
- `docs/antd/ANTD_COMPLETE_SPEC.md`
  Use when a decision depends on Ant Design principles rather than a single numeric token.
- `docs/antd/FINAL_AUDIT.md`
  Use only to confirm coverage and reference locations. Do not treat it as the implementation source of truth.

Check local implementation entry points before editing:

- `src/styles/antd-layout.css`
- `src/styles/antd-colors.css`
- `src/styles/antd-component-sizes.css`
- `src/styles/antd-typography.css`
- `src/styles/antd-motion.css`

Prefer reusing these tokens and variables over introducing fresh one-off values.

## Default Workflow

1. Identify the target surface.
   Component primitive, composed component, screen, or design-system token layer.
2. Read the minimum relevant Ant Design docs from the Source Map.
3. Inspect the target code and any shared tokens or variants it depends on.
4. Build an AntD delta list.
   For each issue, note current state, target state, and source doc.
5. If the task includes cleanup/refactor, write a short cleanup plan before editing.
6. If behavior could regress and coverage is missing, add or update regression tests before cleanup edits.
7. Refactor with the smallest reversible diff.
8. Verify with the strongest affordable evidence.
   Run lint, tests, typecheck, Storybook/dev preview, or focused visual checks as appropriate.

## Fast Failure Scan

Before deep edits, grep for obvious deviations:

- Non-standard control heights: `h-7`, `h-9`, `min-h-7`, `min-h-9`
- Inflated spacing: `gap-6`, `gap-8`, `space-y-6`, `space-y-8`, `p-6`, `px-6`, `py-6`
- Over-rounding: `rounded-xl`, `rounded-2xl`, `rounded-full` on standard controls
- Typography drift: `text-xs` for body text, `text-base` on default 32px controls, too many text scales in one component
- Unclear action hierarchy: multiple primary-looking buttons in one action area
- Decorative motion: long `transition-all`, exaggerated hover/entry transforms, animations without interaction meaning

Flag these first, then confirm against the docs before changing them.

## Non-Negotiable Standards

### Layout and spacing

- Keep spacing on the Ant rhythm: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 48`.
- Default to the 8px-based system from `docs/antd/ANTD_QUICK_REFERENCE.md`.
- Use proximity and alignment to group related fields and actions.
- Prefer reducing excess container chrome before shrinking readable content.

### Control sizing

Use the Ant baseline unless the target pattern clearly calls for another documented size:

- Small: `24px`
- Default: `32px`
- Large: `40px`

This applies first to buttons, inputs, selects, date inputs, and similar controls.

### Radius

Prefer the documented radius scale:

- `2px`
- `4px`
- `6px`
- `8px`

Default controls should generally land on `6px`, with smaller chips/tags using smaller radii and larger containers using `8px` where appropriate.

### Typography

- Default body text: `14px / 22px`
- Helper text: `12px / 20px`
- Small title or emphasized control text: `16px / 24px`
- Use `400` and `500` as the main weights.
- Keep one surface to roughly `3-5` text scales.
- Use `font-variant-numeric: tabular-nums` for aligned numeric data.
- Preserve accessible contrast; the docs target AAA-level contrast for important text.

### Buttons and actions

- One primary button per action area.
- Secondary is the default safe action style.
- Danger styling is reserved for destructive actions.
- Icon-only buttons need clear meaning and should usually have a tooltip.
- Toolbars are right-aligned unless the documented page pattern says otherwise.
- Prefer explicit action labels such as `Publish`, `Save draft`, `Delete`, not vague `OK`/`Confirm` text unless context demands it.

### Forms and data entry

- Group related fields by proximity and clear sectioning.
- Keep labels, help text, validation, and controls aligned and consistent.
- Choose layouts from the documented form patterns instead of ad hoc spacing.
- Do not mix mismatched control heights inside the same form row.

### Lists, tables, and detail surfaces

- Make rows easy to scan.
- Align numbers for comparison, and keep units in headers when possible.
- Keep row actions close to the object they affect.
- Empty states must explain why the state is empty and what the user can do next.

### Icons and motion

- Keep icons simple, clear, and sized from the documented scale: `12 / 14 / 16 / 20 / 24 / 32`.
- Motion must be purposeful, natural, efficient, and restrained.
- Prefer these timing buckets:
  - `0.1s` for hover/click feedback
  - `0.2s` for expand/collapse transitions
  - `0.3s` for enter/exit or richer transitions
- Avoid decorative animation that does not improve comprehension or feedback.

## Refactor Rules

- Prefer token and variant fixes before rewriting markup.
- Reuse existing style variables in `src/styles/antd-*.css` when available.
- Prefer deletion over adding wrapper divs or bespoke utility piles.
- Do not add dependencies to chase the visual result.
- Preserve behavior while normalizing visuals.
- If the component is part of a family, check sibling components and shared variants before finalizing the change.

## Audit Rules

When auditing, report findings first and cite the exact source doc that justifies each call.

For every finding include:

- surface
- issue
- current implementation
- target implementation
- severity
- source doc

Severity guide:

- `high`: breaks hierarchy, accessibility, sizing consistency, or core interaction clarity
- `medium`: clear drift from the standard with moderate UX cost
- `low`: polish inconsistency with low user risk

## Output Contract

Use this shape for audit or refactor summaries:

```markdown
## antd-refactor-audit — <surface>

| ID | Surface | Issue | Current | Target | Severity | Source |
|----|---------|-------|---------|--------|----------|--------|
| A1 | Button group | Multiple primary actions | Two filled primary buttons | Keep one primary, demote the secondary action | high | docs/antd/ANTD_PATTERNS_TEMPLATES.md |

Refactor plan:
- Normalize shared tokens first.
- Update the component variants with the smallest reversible diff.
- Re-run focused verification.

Verification:
- `pnpm lint`
- `pnpm test`
- Visual check in Storybook or app preview
```

If you are implementing changes, follow the findings with a short edit plan and then carry the work through to verification.

## Prompt Variants

Use these invocation patterns when the user intent needs to be explicit:

- Audit and refactor:
  `使用 antd-refactor-audit 按 docs/antd 的新设计标准审核并重构这个组件，先列出差距，再直接修改并完成验证。`
- Audit only:
  `使用 antd-refactor-audit 按 docs/antd 的新设计标准审核这个组件，只输出问题清单、严重级别、依据文档和修改建议，不要改代码。`

## Verification

Choose the lightest verification that proves the claim:

- Token or utility edits:
  Run targeted tests, lint, and inspect affected consumers.
- Primitive component edits:
  Run lint, tests, typecheck, and a focused preview if available.
- Screen or layout edits:
  Add a visual check in Storybook, app preview, or screenshot-based review.

Minimum expectations after edits:

- `pnpm lint`
- relevant tests
- relevant build or typecheck if the edited surface is widely reused

If something could not be verified, say so explicitly and name the gap.

## Decision Heuristics

- If a rule conflict appears, prefer clarity, hierarchy, and consistency over ornament.
- If several acceptable Ant patterns exist, choose the one already established elsewhere in the repo.
- If a component is close to compliant, do not rewrite it just to make it look more "Ant-like".
- If a surface mixes layout, copy, tokens, and interaction drift, fix in this order:
  1. action hierarchy
  2. control size consistency
  3. spacing and alignment
  4. typography
  5. icon and motion polish

## Anti-Slop Guardrails

- Do not introduce generic "modern dashboard" cosmetics that are not backed by the docs.
- Do not add oversized gradients, glassmorphism, giant radii, or decorative motion to "upgrade" a component.
- Do not collapse all surfaces into identical card stacks if the documented page pattern calls for a stronger structure.
- Do not replace precise semantic actions with vague button text or icon-only controls.
