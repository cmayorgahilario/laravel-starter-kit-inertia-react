---
title: Code quality
description: Pint, PHPStan, Rector, ESLint, Prettier and commitlint — settings and commands.
---

# Code quality

## Overview

The project enforces a strict quality bar: PHP is formatted by Pint, statically analyzed by PHPStan at
`max` level and refactored by Rector; JS/TS is linted by ESLint and formatted by Prettier; commit
messages are validated by commitlint. Most of these also gate the git hooks
([git-hooks.md](git-hooks.md)) and CI ([../continuous-integration/index.md](../continuous-integration/index.md)).

## PHP

| Tool               | Setting                                                                                     | Config              |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------- |
| Pint               | `laravel` preset (with custom rules)                                                        | `pint.json`         |
| PHPStan (Larastan) | level `max`, strict checks; paths: app, bootstrap/app.php, config, database, public, routes | `phpstan.neon.dist` |
| Rector             | Laravel sets + dead-code/code-quality/type-declarations/etc., PHP up to 8.5, parallel       | `rector.php`        |

```bash
./vendor/bin/sail pint                       # format
./vendor/bin/sail phpstan analyse            # static analysis
./vendor/bin/sail rector process --dry-run   # refactor preview
```

> [!NOTE]
> PHPStan runs at `max` and the type-coverage gate is 100% (see [../testing/index.md](../testing/index.md)).
> Do not lower these thresholds.

## JS / TS

| Tool     | Setting                                                                             | Config               |
| -------- | ----------------------------------------------------------------------------------- | -------------------- |
| ESLint   | TypeScript + React 19, type-aware; ignores generated code (shadcn `ui/`, Wayfinder) | `eslint.config.js`   |
| Prettier | 4 spaces, single quotes, trailing commas, print width 120; Blade + Tailwind plugins | `prettier.config.js` |

```bash
./vendor/bin/sail pnpm lint           # eslint --fix
./vendor/bin/sail pnpm lint:check     # eslint (no fix)
./vendor/bin/sail pnpm format         # prettier --write resources/
./vendor/bin/sail pnpm types:check    # tsc --noEmit
```

The Prettier Tailwind plugin sorts classes (including inside `clsx`/`cn`/`cva`) using
`resources/css/app.css` as the stylesheet; Blade PHP formatting is left to Pint.

## Commits

Commit messages follow **Conventional Commits**, validated by commitlint
(`@commitlint/config-conventional` + custom types). Allowed types include `feat`, `fix`, `docs`,
`style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `config`, `security`, `release`.
Header/subject max 150 chars; body max 250.

> [!NOTE]
> The user commits manually. Do not run `git commit` on their behalf.
