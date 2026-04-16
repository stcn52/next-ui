# Workspace Status

This file gives future agents the current release and CI/CD picture for `/home/chenyang/kk/next-ui`.

## Current State

- Branch: `main`
- npm package: `@stcn52/next-ui`
- Current published version: `0.2.2`
- Current latest git release: `v0.2.2`
- Backfilled releases now exist for `v0.1.0`, `v0.2.0`, `v0.2.1`, and `v0.2.2`
- Main branch has one post-release commit that includes compact-ui-review refactors for ChatSender, ChatBubble, Sidebar, and ChatConversations

## Workflow Map

- Push to `main`:
  triggers `.github/workflows/ci.yml`
  runs lint, unit tests, library build, Storybook build, and Playwright E2E
- Push a tag like `v0.2.1`:
  triggers `.github/workflows/publish.yml`
  builds the library and publishes to npm using `NPM_TOKEN`
- Push to `main` also triggers `.github/workflows/storybook.yml`
  builds Storybook and deploys to GitHub Pages when Pages is enabled
- All repo workflows now set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`
  to opt JavaScript actions into the Node 24 runtime ahead of GitHub's default switch
- Workflows now use `pnpm/action-setup@v6`
  to align the pnpm setup action itself with the newer Node 24 action runtime
- Trusted dependency build scripts now live in `pnpm-workspace.yaml` under `allowBuilds`
  so CI, Storybook deploy, publish, and local installs all rely on the same pnpm approval source

## One-Step Release Rule

If the user asks to "push and publish together", do all of the following as one release lane:

1. Make sure `package.json` version and `CHANGELOG.md` target version match.
2. Run:
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build:lib`
3. Commit the release-ready changes on `main`.
4. Push `main`.
5. Create and push tag `v<package.json version>`.
6. Verify:
   - `gh run list --repo stcn52/next-ui`
   - `gh release list --repo stcn52/next-ui`
   - `npm view @stcn52/next-ui version dist-tags.latest`

## Recent CI Signal

Latest known remote status after the `0.2.1` release lane:

- `Publish to npm` for `v0.2.1`: success
- `Deploy Storybook to GitHub Pages`: success
- `CI` for the release commit first failed on an outdated E2E assertion
- A follow-up `main` commit fixed that E2E assertion, and `CI` is green again
- Do not assume `main` is green after future pushes; always re-check `gh run list`

## Release Notes Guidance

- If a new npm version is published, create or verify the matching GitHub Release.
- Keep `CHANGELOG.md` aligned with the package version.
- If npm has a newer version than GitHub Releases, backfill the missing GitHub Release.

## Agent Expectations

- Prefer direct evidence from `gh run list`, `gh release list`, and `npm view` over assumptions.
- Update this file when the release baseline changes materially.
