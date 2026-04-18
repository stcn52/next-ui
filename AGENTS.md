# Workspace Status

This file gives future agents the current release and CI/CD picture for `/home/chenyang/kk/next-ui`.

## Current State

- Branch: `main`
- npm package: `@stcn52/next-ui`
- Current published version: `0.2.7`
- Current latest git tag: `v0.2.7`
- Current latest GitHub Release: `v0.2.6`

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
- Workflows pin pnpm to `10.33.0`
  to avoid GitHub runner drift from `version: latest` and keep installs aligned with the verified lockfile behavior
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

Latest known release baseline:

- `v0.2.7` is tagged locally and published to npm
- Latest GitHub Release currently visible is `v0.2.6`
- `#22` is closed: the Node 24-compatible GitHub Actions runtime migration is in place
- Current `main` CI failures are not from the Node 20 deprecation warning anymore; investigate install/lockfile drift separately if Actions turn red again
- Do not assume `main` is green after future pushes; always re-check `gh run list`

## Release Notes Guidance

- If a new npm version is published, create or verify the matching GitHub Release.
- Keep `CHANGELOG.md` aligned with the package version.
- If npm has a newer version than GitHub Releases, backfill the missing GitHub Release.

## Agent Expectations

- Prefer direct evidence from `gh run list`, `gh release list`, and `npm view` over assumptions.
- Update this file when the release baseline changes materially.

---

## Codex Turn Boundary Guidance

- 助记标识：`EOT=CHECK_NEXT_STEP`。
- 当任务已经完成、但对话上下文看起来仍可能继续时，结尾用一句简短确认，邀请用户给出下一步任务。
- 不要依赖 `AskQuestions`、`#file:` 这类 Copilot 专属语法；Codex 只需要普通自然语言即可。
- 如果用户已经明确表示停止、取消，或只需要一次性输出，就直接收口，不要强行追加追问。
- 如果当前任务还没完成，先继续执行，不要为了“收口规则”中断工作。
- 结尾确认应保持简短，最好直接给出 2 到 3 个可选下一步，外加一个自由输入的邀请。
- 当下一步存在明显分叉且会影响实现路径时，先澄清再动手。
- 对于翻译、总结、改写这类一次性请求，不额外追加追问，除非用户明确希望继续协作。
