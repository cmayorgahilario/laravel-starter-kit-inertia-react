---
title: Continuous integration & deployment
description: The GitHub Actions workflows that gate PRs and pushes, and the Laravel Cloud deploy hooks.
---

# Continuous integration & deployment

**Why it exists:** document the cloud pipeline — which workflows run when, what blocks a merge, and how
deployment is triggered.
**Covers:** the GitHub Actions workflows in `.github/workflows/`, the reusable jobs, the deploy
trigger, the Dependabot dependency-update config and the CodeRabbit automated PR review.
**Does not cover:** the same tools run locally via git hooks (see [../tooling/git-hooks.md](../tooling/git-hooks.md)).

## Overview

CI is composed of small **reusable workflows** (`workflow_call`) orchestrated by two entry points:

| Entry workflow                         | Trigger                            | Role           |
| -------------------------------------- | ---------------------------------- | -------------- |
| `quality-gate.yml` (CI Quality Gate)   | PR to `master`                     | Blocking gate. |
| `quality-check.yml` (CI Quality Check) | push to any branch except `master` | Fast feedback. |

Both call the same reusable jobs (stored as separate files):

| Reusable workflow     | Checks                                                        |
| --------------------- | ------------------------------------------------------------- |
| `static-analysis.yml` | PHP static analysis (PHPStan).                                |
| `lint-format.yml`     | Frontend lint & format (ESLint + Prettier).                   |
| `test-fast.yml`       | Sharded Unit+Feature suite (uploads per-shard coverage).      |
| `test-arch.yml`       | Architecture tests.                                           |
| `test-static.yml`     | Static-analysis tests (e.g. profanity).                       |
| `test-coverage.yml`   | Merges shard coverage and (gate only) enforces the threshold. |
| `test-browser.yml`    | Browser tests (Playwright).                                   |
| `update-shards.yml`   | Maintains the test shard distribution.                        |

## Quality Gate (PR to master)

Runs all the reusable jobs in parallel. The **Coverage Gate** consumes the shard coverage from
`test-fast` and fails the PR if combined line coverage is below `100`. A summary job fails if any of the
quality, test, coverage or browser jobs failed.

## Quality Check (push to feature branches)

Lighter and faster: frontend lint, PHP static analysis, sharded tests and arch tests are **blocking**;
the coverage job runs as an **informational report without a min gate**. The summary job blocks only on
lint/analysis/tests, not on coverage.

## Deployment

`deploy.yml` triggers deploys to **Laravel Cloud** via deploy-hook URLs (no build/ssh in the workflow,
just a `curl` POST to the hook):

| Environment | Trigger                                                    | Secret                       |
| ----------- | ---------------------------------------------------------- | ---------------------------- |
| Production  | a PR to `master` is **merged** (closed + merged)           | `DEPLOY_HOOK_URL_PRODUCTION` |
| Staging     | `CI Quality Check` completes **successfully** on `develop` | `DEPLOY_HOOK_URL_STAGING`    |

So staging deploys are gated on the `develop` push CI passing, and production deploys only on a merged
master PR.

## Automated PR review (CodeRabbit)

`.coderabbit.yaml` configures **CodeRabbit**, the AI reviewer that comments on every PR. It is tuned to
this project rather than left on defaults: reviews are in `en-US`, the `assertive` profile matches the
strict quality bar, and generated/vendored paths (`vendor/`, `public/js`, `public/css`, Wayfinder
helpers, shadcn base UI, lockfiles) are excluded via `path_filters`. Per-path `path_instructions` teach
it the project conventions — bounded-context namespacing, PHPStan `max`, 100% type-coverage, Pest
(`test()` not `it()`), English-only code/UI — and `auto_title_instructions` enforce Conventional Commits
titles. It complements, but does not replace, the blocking Actions gate above.

## Dependency updates

`.github/dependabot.yml` opens weekly PRs (Mondays) for three ecosystems: `composer`, `npm` (reads
`pnpm-lock.yaml`) and `github-actions`. Minor/patch bumps are grouped per ecosystem to reduce noise, and
the commit prefixes (`chore`, `ci`) match the Conventional Commits rules so the PRs pass commitlint.
