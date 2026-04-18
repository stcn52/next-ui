# Visual Regression Guide

This project uses Playwright against Storybook to keep page-level screenshots stable in CI.

## Where baselines live

- Test files: `e2e/*.spec.ts`
- Snapshot folders: `e2e/*.spec.ts-snapshots/`
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
3. Keep seeded data, time-sensitive content, and menu state stable.
4. Add the generated baseline to the matching `*.spec.ts-snapshots/` folder.

## Review rules

- Do not update snapshots together with unrelated UI work.
- Do not rewrite a whole snapshot folder when only one story changed.
- Treat snapshot diffs as product changes, not test artifacts.
- If a change is hard to review from the image alone, attach the Storybook URL or before/after screenshots in the PR.

## CI expectations

- `pnpm test:e2e` should stay green after snapshot updates.
- If UI flows changed, include the targeted Playwright command you ran in the PR summary.
- When a snapshot-covered surface changes, reviewers should confirm both behavior and screenshot diffs.
