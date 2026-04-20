---
title: Git Hooks
description: Lefthook pre-commit pipeline and Commitlint message enforcement.
---

# Git Hooks

This project uses [Lefthook](https://github.com/evilmartians/lefthook) to enforce quality gates at commit time and [Commitlint](https://commitlint.js.org/) to validate commit messages against the Conventional Commits specification. Both run automatically — no manual setup is needed after `bun install`.

## Pipeline Overview

Two hook stages run on every `git commit`:

| Stage | Trigger | What runs |
| --- | --- | --- |
| `pre-commit` | Before the commit is created | Three parallel checks: lint, types, pint |
| `commit-msg` | After you enter a commit message | Commitlint validates the message format |

The pre-commit checks run in parallel (`parallel: true` in `lefthook.yml`), so all three execute simultaneously. The commit is blocked if any check exits with a non-zero code.

## Pre-commit Checks

Three checks run in parallel before each commit:

| Check | Command | What It Catches |
| --- | --- | --- |
| `lint` | `bun run test:lint` | ESLint and oxlint rule violations in JS/TS files |
| `types` | `bun run test:types` | TypeScript type errors across the frontend codebase |
| `pint` | `vendor/bin/sail bin pint --dirty --test` | PHP formatting violations (test-only, no auto-fix) |

The `pint` check runs inside the Sail Docker container. **Sail must be running** (`vendor/bin/sail up -d`) before committing, otherwise the pint step will fail with a connection error.

## Commit Message Format

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, enforced by `@commitlint/config-conventional`:

```
type(scope): short description
```

**Rules:**
- `type` is required and must be one of the values below
- `scope` is optional — any scope string is accepted
- `description` is required and should be lowercase, imperative mood
- No period at the end of the subject line

**Valid types:**

| Type | Use for |
| --- | --- |
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring (no feature, no fix) |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD pipeline changes |
| `chore` | Maintenance tasks (tooling, config) |
| `revert` | Reverts a previous commit |
| `config` | Configuration file changes (env, settings, linter) |
| `security` | Security fixes (vulnerabilities, patches) |
| `release` | Version bump and changelog updates |

**Examples:**

```bash
# Valid
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix: resolve null pointer in user model"
git commit -m "docs(api): update endpoint reference"

# Invalid — will be rejected by commitlint
git commit -m "updated stuff"
git commit -m "WIP"
git commit -m "FEAT: add login"
```

## Setup

Hooks are installed automatically. The `package.json` `postinstall` script runs `lefthook install` after every `bun install`:

```bash
bun install   # lefthook install runs automatically via postinstall
```

No manual `lefthook install` call is needed. If you clone the repository and run `bun install`, the hooks are active immediately.

## Troubleshooting

**Sail must be running for the pint check.**
The `vendor/bin/sail bin pint --dirty --test` command executes inside Docker. Start Sail before committing:

```bash
vendor/bin/sail up -d
```

**oxlint may report warnings, not errors.**
Some oxlint rules emit warnings rather than errors. Warnings do not block the commit — only rules that exit non-zero will fail the hook. If `bun run test:lint` exits 0 despite visible warnings, the commit will proceed.

**Re-installing hooks after a fresh clone.**
If hooks are missing (e.g., after a `git clone` without running `bun install`), install them manually:

```bash
bun run lefthook install
```

**Bypassing hooks in an emergency.**
Use `--no-verify` to skip all hooks for a single commit. Reserve this for genuine emergencies — bypassing hooks means skipping quality gates:

```bash
git commit --no-verify -m "fix: emergency hotfix"
```

## Possible Improvements

The following hooks are not included in the starter kit to keep onboarding lightweight, but are recommended for production projects. Each section includes a ready-to-paste `lefthook.yml` snippet.

### Pre-push: Full Test Suite and Static Analysis

Running the full test suite, type coverage, and static analysis before pushing catches issues that pre-commit checks (which only lint staged files) would miss.

```yaml
pre-push:
  commands:
    tests:
      run: vendor/bin/sail bin pest --parallel
      fail_text: 'Test suite failed. Fix all failing tests before pushing.'

    type-coverage:
      run: vendor/bin/sail bin pest --type-coverage --compact --min=100
      fail_text: 'Type coverage below 100%. Add missing type declarations.'

    phpstan:
      glob:
        - '*.php'
        - 'app/**/*.php'
        - 'routes/**/*.php'
        - 'config/**/*.php'
        - 'database/**/*.php'
      run: vendor/bin/sail bin phpstan analyse --no-progress --error-format=table
      fail_text: 'PHPStan errors found. Fix before pushing.'

    rector-check:
      run: vendor/bin/sail bin rector process --dry-run --no-progress-bar
      fail_text: 'Pending Rector changes. Run rector process to apply fixes.'
```

**Trade-off:** Pre-push hooks add 30-90 seconds to every push. For teams that prefer speed, run these checks in CI instead and skip the pre-push stage entirely.

### Pre-commit: Branch Protection

Prevent accidental direct commits to protected branches. Useful when GitHub branch protection rules are not configured or as a local safety net.

```yaml
pre-commit:
  commands:
    protect-branches:
      run: |
        current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)
        for branch in main master develop; do
          case "$current_branch" in
            "$branch")
              echo "Commit blocked: '$current_branch' is a protected branch."
              echo "Create or switch to a feature branch first."
              exit 1
              ;;
          esac
        done
```

**Note:** This is a local-only guard. For team-wide enforcement, use GitHub branch protection rules (Settings > Branches > Branch protection rules). The two approaches complement each other — local hooks catch mistakes before they reach the remote.

### Post-merge: Auto-install Dependencies

Automatically run dependency installation when `composer.lock` or `bun.lock` changes after a merge or pull. Prevents "works on my machine" issues from stale dependencies.

```yaml
post-merge:
  commands:
    composer-install:
      files: git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD
      glob:
        - 'composer.json'
        - 'composer.lock'
      run: vendor/bin/sail composer install --optimize-autoloader
      fail_text: 'Failed to install Composer dependencies.'

    bun-install:
      files: git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD
      glob:
        - 'package.json'
        - 'bun.lock'
      run: bun install
      fail_text: 'Failed to install bun dependencies.'
```

**Requirement:** Sail must be running for `composer install`. The `bun install` command runs on the host (where git hooks execute).

### Commitlint: Stricter Rules

The starter kit inherits all defaults from `@commitlint/config-conventional`. For stricter enforcement, add these rules to `commitlint.config.ts`:

```typescript
rules: {
    // ... existing type-enum rule ...
    'header-max-length': [2, 'always', 100],
    'subject-max-length': [2, 'always', 150],
    'body-max-line-length': [2, 'always', 250],
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['upper-case', 'camel-case', 'kebab-case', 'pascal-case', 'snake-case', 'start-case']],
    'body-leading-blank': [1, 'always'],
},
```

These rules enforce consistent casing, line length limits, and blank line formatting. The starter kit omits them because `config-conventional` already provides sensible defaults for most of these.
