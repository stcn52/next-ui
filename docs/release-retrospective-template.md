# Release Retrospective Template

Date: YYYY-MM-DD
Release tag: `vX.Y.Z`
Published package: `@stcn52/next-ui@X.Y.Z`

## Summary

Briefly explain:

- what this release was for
- whether it was feature-driven, stability-driven, or release-repair work
- what changed in the repository or delivery lane because of it

## What Shipped

### User-facing / repo-facing changes

- Main shipped outcomes
- Important fixes
- Release metadata updates if relevant

### Test or delivery stability changes

- CI fixes
- visual regression stabilization
- release automation or workflow adjustments

## Why This Release Was Needed

Capture the operational reason, not just the code diff.

Examples:

- unpublished work had accumulated on `main`
- CI was red or noisy
- a published package did not match repository state
- release metadata was incomplete

## What Went Well

- What reduced risk
- What was verified clearly
- What made the release easier than expected

## What We Learned

### 1. Key lesson

State one concrete lesson that should change future behavior.

### 2. Key lesson

State one concrete lesson that should change future behavior.

### 3. Key lesson

State one concrete lesson that should change future behavior.

## Verification Evidence

List the commands, workflows, and external checks used to prove the release was real and healthy.

- `pnpm lint`
- `pnpm test`
- `pnpm build:lib`
- `pnpm test:e2e`
- `gh run list --repo ...`
- `gh release list --repo ...`
- `npm view ... version dist-tags.latest`

## Follow-ups

- Things to keep doing
- Things to automate next time
- Known process gaps that should be addressed later
