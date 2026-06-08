---
title: Git hooks (Lefthook)
description: What runs on commit-msg, pre-commit, pre-push and post-merge, and why hooks run through Sail.
---

# Git hooks (Lefthook)

## Overview

Git hooks are managed by **Lefthook** (`lefthook.yml`). Every hook command runs **inside Sail**, because
Node lives in nvm and is not on the PATH of git's hook/GUI environment — running tools directly there
would fail.

> [!WARNING]
> Install the hooks from the **HOST**, not inside the container:
>
> ```bash
> lefthook install
> ```
>
> Running `lefthook install` inside the container (e.g. via a postinstall script) writes
> `/var/www/html` paths and breaks the hooks. If hooks misbehave, reinstall from the host.
>
> To enforce this, `pnpm-workspace.yaml` (pnpm v11 `allowBuilds`, `strictDepBuilds` on by default)
> explicitly sets `lefthook: false`, so its postinstall never runs during a containerized
> `pnpm install`. `unrs-resolver: true` is the only build script allowed.

## Hooks

### commit-msg

- `commitlint` — validates the conventional-commit format via
  `./vendor/bin/sail pnpm exec commitlint --edit {1}`. See [code-quality.md](code-quality.md).

### pre-commit (parallel)

- `pint` — `./vendor/bin/sail pint {staged_files}` on `**/*.php` (re-stages fixed files).
- `js-lint-format` (piped) — `eslint --fix` then `prettier --write` on staged JS/TS, via Sail + pnpm.
- `prettier-assets` — `prettier --write` on staged JSON, MD, YML, CSS, SCSS and Blade.

### pre-push (piped)

- `protect-branches` — blocks pushing directly to `master`.
- `quality-checks` (parallel) — all through `./vendor/bin/sail bin …`:
    - `pest --parallel` (tests)
    - `pest --type-coverage --compact --min=100`
    - `pest --profanity --compact --language=en,es`
    - `phpstan analyse --no-progress`
    - `rector process --dry-run`

### post-merge

- `composer install --optimize-autoloader` when `composer.json`/lock changed.
- `pnpm install` + `pnpm build:ssr` when `package.json`/lock changed.

Both run through Sail.

## What NOT to do

- Do not push directly to `master`; the `protect-branches` hook blocks it (and CI gates PRs anyway).
- Do not run the hook tools outside Sail; they depend on the container's Node and PHP.
