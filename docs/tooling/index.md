---
title: Tooling
description: Local developer tooling — git hooks and the code-quality stack.
---

# Tooling

**Why it exists:** document the local tooling that runs on the developer's machine — git hooks and the
formatters/analyzers that gate commits and pushes.
**Covers:** Lefthook (hooks), and the code-quality tools (Pint, PHPStan, Rector, ESLint, Prettier,
commitlint).
**Does not cover:** the CI pipeline that re-runs these in the cloud (see
[../continuous-integration/index.md](../continuous-integration/index.md)) or the test suites
themselves (see [../testing/index.md](../testing/index.md)).

## Sub-pages

| Topic                                                              | Link                               |
| ------------------------------------------------------------------ | ---------------------------------- |
| Git hooks (Lefthook) and the Sail constraint                       | [git-hooks.md](git-hooks.md)       |
| Code quality (Pint, PHPStan, Rector, ESLint, Prettier, commitlint) | [code-quality.md](code-quality.md) |

## At a glance

| Tool               | Scope                         | Config                 |
| ------------------ | ----------------------------- | ---------------------- |
| Lefthook           | git hooks                     | `lefthook.yml`         |
| Pint               | PHP formatting                | `pint.json`            |
| PHPStan (Larastan) | PHP static analysis           | `phpstan.neon.dist`    |
| Rector             | PHP refactoring               | `rector.php`           |
| ESLint             | JS/TS linting                 | `eslint.config.js`     |
| Prettier           | JS/TS/Blade/assets formatting | `prettier.config.js`   |
| commitlint         | commit message format         | `commitlint.config.js` |
