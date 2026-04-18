# Visual Regression Guide

This project uses Playwright against Storybook to keep page-level screenshots stable in CI.

## Where baselines live

- Test files: `e2e/*.spec.ts`
- Snapshot folders: `e2e/*.spec.ts-snapshots/`
- Shared helpers: `e2e/visual-test-helpers.ts`
- Current FileManager baselines:
  - `e2e/data-grid-file-tree.spec.ts-snapshots/file-manager-page-chromium-linux.png`
  - `e2e/data-grid-file-tree.spec.ts-snapshots/file-manager-page-dark-chromium-linux.png`

## Standard workflow

1. Run the narrowest possible visual test first.
2. Review whether the UI change is intentional.
3. Update snapshots only for approved visual changes.
4. Review changed `.png` files in the pull request.

## Common commands

```bash
# Verify the existing FileManager baselines
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "FileManager"

# Update the default FileManager baseline after an intentional UI change
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "FileManager" --update-snapshots

# Update the dark FileManager baseline after an intentional UI change
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "dark story" --update-snapshots
```

## Adding a new page-level visual test

Use a stable Storybook story ID from `iframe.html?id=...` so the screenshot target stays reproducible in CI.

Prefer this pattern:

1. Create or reuse a deterministic Storybook story.
2. Open the story through its `iframe.html?id=...` URL in Playwright.
3. Freeze time before navigation when the story renders current time, relative dates, or `Date.now()`-driven content.
4. Keep seeded data, time-sensitive content, and menu state stable.
5. Add the generated baseline to the matching `*.spec.ts-snapshots/` folder.

## Determinism rules

Visual stories must not depend on ambient runtime state.

- If a story renders the current time or date, call `freezeVisualTime(page)` from `e2e/visual-test-helpers.ts`
- Do not add screenshot coverage for stories that still depend on live clocks, random IDs in visible text, or unstable loading sequences
- Prefer fixed Storybook args and seeded data over test-time mutation where possible
- Keep browser timezone fixed to `UTC`; this is already configured in `playwright.config.ts`

Current fixed visual time:

- `2026-04-18T05:38:00.000Z`

Update that value only when there is a deliberate reason, and expect snapshot changes if you do.

## Screenshot helper rules

Do not inline `toHaveScreenshot()` options in every spec unless a test has a concrete reason to differ.

Prefer the shared helpers from `e2e/visual-test-helpers.ts`:

- `expectPanelScreenshot()` for small popup or panel surfaces
- `expectMediumScreenshot()` for medium component surfaces
- `expectPageScreenshot()` for full-page or large-layout surfaces

The helper centralizes:

- disabled animations
- hidden carets
- CSS-scale screenshots
- bounded tolerance for Linux font rasterization drift

If a new surface needs a different tolerance, update the helper deliberately instead of sprinkling one-off thresholds across specs.

## Review rules

- Do not update snapshots together with unrelated UI work.
- Do not rewrite a whole snapshot folder when only one story changed.
- Treat snapshot diffs as product changes, not test artifacts.
- If a change is hard to review from the image alone, attach the Storybook URL or before/after screenshots in the PR.
- If a snapshot diff comes only from time, timezone, or text rasterization noise, fix the test setup first instead of accepting the drift blindly.

## CI expectations

- `pnpm test:e2e` should stay green after snapshot updates.
- If UI flows changed, include the targeted Playwright command you ran in the PR summary.
- When a snapshot-covered surface changes, reviewers should confirm both behavior and screenshot diffs.
- GitHub Actions is the source of truth for Linux screenshot stability, so verify there before calling a visual stabilization change complete.
