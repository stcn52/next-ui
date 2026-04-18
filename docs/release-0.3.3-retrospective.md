# Release 0.3.3 Retrospective

Date: 2026-04-19
Release tag: `v0.3.3`
Published package: `@stcn52/next-ui@0.3.3`

## Summary

`0.3.3` was a follow-up patch release after `0.3.2`.

The main goal was not a large feature launch. The goal was to bring `main`, npm, git tags, GitHub Releases, and CI back into a clean and trustworthy state after post-`0.3.2` work had accumulated on `main`.

This release shipped two kinds of changes together:

- The unreleased layout-system and story fixes that had landed on `main` after `v0.3.2`
- A stabilization pass for Playwright visual regression coverage so GitHub Actions Linux runners would stop failing on non-material screenshot drift

## What Shipped

### User-facing / repo-facing changes

- Added the layout-system primitives, stories, hooks, store helpers, and Ant Design alignment docs/examples that were already on `main`
- Restored the missing `Label` import in the layout-system story coverage
- Published the package as `0.3.3`
- Created the matching GitHub Release for `v0.3.3`

### Test stability changes

- Added a shared Playwright visual helper at `e2e/visual-test-helpers.ts`
- Froze browser time for visual stories so screenshots do not drift with the current clock
- Pinned Playwright browser timezone to `UTC`
- Centralized screenshot tolerances so Linux font rasterization noise does not fail CI while real layout regressions still surface

## Why 0.3.3 Was Needed

`v0.3.2` was already published, but `main` still contained unreleased work and unstable visual checks:

- `main` had commits after `v0.3.2` that were not represented in the published package
- The visual regression suite was sensitive to current-time rendering in Storybook
- GitHub Actions Linux runners showed screenshot drift large enough to fail CI even when local behavior was correct

Without `0.3.3`, the repository would have remained in an awkward state where:

- the latest published package lagged behind `main`
- release provenance was harder to explain
- CI stayed noisy and reduced confidence in future UI changes

## What We Learned

### 1. Visual stories must be deterministic

If a Storybook surface renders current time, current date, or other ambient runtime state, it should be frozen before adding screenshot coverage.

### 2. Zero-noise screenshot assertions are not always realistic in CI

Linux runner text rasterization can differ slightly from local environments. Small tolerance is acceptable if it is intentionally bounded and does not mask layout or content regressions.

### 3. Release bookkeeping should be completed in the same lane

After a publish succeeds, the repo still needs one last bookkeeping pass:

- verify npm
- verify GitHub Release
- verify tag
- sync local release status docs such as `AGENTS.md`

## Verification Evidence

The `0.3.3` release lane was verified with:

- `pnpm lint`
- `pnpm test`
- `pnpm build:lib`
- `pnpm test:e2e`
- GitHub Actions `main` CI success before tagging
- GitHub Actions publish workflow success for `v0.3.3`
- `npm view @stcn52/next-ui version dist-tags.latest`
- `gh release list --repo stcn52/next-ui`

## Follow-ups

- Keep future visual tests on deterministic Storybook stories only
- Reuse `e2e/visual-test-helpers.ts` instead of copying screenshot options into new specs
- Treat release metadata sync as part of the release lane, not as an afterthought
- Prefer one release-ready commit before tagging when practical, but do not rewrite published tag history after npm has shipped
