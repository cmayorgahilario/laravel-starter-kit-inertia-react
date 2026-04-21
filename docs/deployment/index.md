---
title: Deployment
description: Deployment posture documentation — current state, CI pipeline, and what is not yet configured.
---

# Deployment

This page documents the project's deployment posture honestly: what CI infrastructure exists, and what production deployment tooling has not yet been configured.

## Current State

No production deployment configuration exists in this repository. The following artifacts were checked and are absent:

| Artifact | Purpose if present | Status |
| --- | --- | --- |
| `Dockerfile` (repo root) | Production container image definition | **Absent** |
| `compose.prod.yaml` | Production Compose override | **Absent** |
| `fly.toml` | Fly.io application config | **Absent** |
| `vercel.json` | Vercel project config | **Absent** |
| `render.yaml` | Render.com service manifest | **Absent** |
| `railway.toml` | Railway project config | **Absent** |
| `Procfile` | Heroku / generic process file | **Absent** |
| `app.yaml` | Google App Engine config | **Absent** |
| `Envoy.blade.php` | Laravel Envoy deployment script | **Absent** |
| `deploy.php` | Deployer (deployer.org) task file | **Absent** |
| `.github/workflows/deploy.yml` | GitHub Actions deploy workflow | **Absent** |
| `k8s/` directory | Kubernetes manifests | **Absent** |

> **Note:** `vendor/laravel/sail/runtimes/` contains Sail's development Dockerfiles. These are development-only and are **not** suitable for production deployment — they are managed by the Sail package, not this project.

## What Is Present

### CI Pipeline

A CI pipeline is wired under `.github/workflows/`. The entry point is `ci.yml`, which fans out to three reusable workflows:

```
.github/workflows/
├── ci.yml           ← orchestrator (runs on every push and on PRs to main)
├── php-quality.yml  ← PHP linting and static analysis
├── js-quality.yml   ← JavaScript/TypeScript quality checks
└── tests.yml        ← test suite (depends on php-quality and js-quality)
```

`ci.yml` uses concurrency cancellation (`cancel-in-progress: true`) so redundant runs on the same ref are killed. The `tests` job has an explicit `needs: [php-quality, js-quality]` gate — tests only run when quality checks pass.

For details on what each quality workflow runs, see [Tooling → Static Analysis](../tooling/static-analysis.md).

### Dependabot

`.github/dependabot.yml` is present and monitors three package ecosystems weekly (Monday 06:00 UTC):

| Ecosystem | Group name |
| --- | --- |
| `composer` | `composer-deps` |
| `npm` | `npm-deps` |
| `github-actions` | `github-actions-deps` |

PRs are opened with `chore(deps)` prefixed commit messages and scoped labels.

### Local Runtime

The local development runtime is Laravel Sail (Docker Compose). The `compose.yaml` defines six services: `pgsql`, `redis`, `typesense`, `rustfs`, `mailpit`, and `soketi`. This is a development environment — it is not a production topology.

## Not Yet Configured

::: warning Deployment Not Yet Configured
Production deployment has not been configured for this project. No platform has been selected, no deployment pipeline exists, and no container image is defined for production use.

A future milestone will introduce deployment infrastructure. No provider or strategy is pre-selected — that decision will be made when the milestone is planned.
:::

## Cross-links

- [Tooling](../tooling/index.md) — CI workflow details, static analysis, and git hooks
- [Tooling → Static Analysis](../tooling/static-analysis.md) — what the php-quality and js-quality jobs run
