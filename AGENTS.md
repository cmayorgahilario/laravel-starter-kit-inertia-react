# AGENTS.md

Minimal brief for AI agents (Claude Code, Cursor, Copilot, Codex…). Only what applies from the first
turn; **all the detail lives in `docs/`** (read on demand). Start at `docs/index.md`.

Laravel Starter Kit is a Laravel 13 / PHP 8.5 application with a Filament 5 admin panel and an Inertia.js v3 +
React 19 SPA. Authentication runs on Fortify + Sanctum, with 2FA and passkeys (WebAuthn). All
documentation is in English.

## Runtime / Environment

- Everything runs in **Docker via Laravel Sail**. The binary is `./vendor/bin/sail` (recommended alias:
  `sail`). Services in `compose.yaml`: Postgres 18, Valkey, Meilisearch, RustFS (S3), Mailpit, Soketi.
- **Non-negotiable rule:** never run `php`, `artisan`, `composer`, `node`, `pnpm`, `pest` or `npx`
  directly. Always prefix with `./vendor/bin/sail` (e.g. `./vendor/bin/sail artisan …`). Node lives in
  nvm and is missing from the hooks/GUI PATH; running commands outside Sail breaks the store.
- Real app defaults (not what `compose.yaml` suggests): database `pgsql`; cache, queue and session on
  `database`; mail over SMTP to Mailpit; filesystem disk `local`; broadcast `log`. Detail and caveats
  in `docs/services/index.md`.
- Boot: see `docs/getting-started/index.md`.

## Essential commands

| Action               | Command                                                         |
| -------------------- | --------------------------------------------------------------- |
| Start environment    | `./vendor/bin/sail up -d`                                       |
| Migrate              | `./vendor/bin/sail artisan migrate`                             |
| Dev (Vite)           | `./vendor/bin/sail pnpm dev`                                    |
| Build frontend       | `./vendor/bin/sail pnpm build`                                  |
| Tests (Unit+Feature) | `./vendor/bin/sail pest`                                        |
| A single test        | `./vendor/bin/sail pest --filter="test name"`                   |
| Architecture tests   | `./vendor/bin/sail pest --testsuite=Arch`                       |
| Type coverage (100%) | `./vendor/bin/sail pest --type-coverage --min=100`              |
| Profanity (en, es)   | `./vendor/bin/sail pest --profanity --language=en,es`           |
| Static analysis      | `./vendor/bin/sail phpstan analyse`                             |
| Refactor (dry-run)   | `./vendor/bin/sail rector process --dry-run`                    |
| PHP formatting       | `./vendor/bin/sail pint`                                        |
| Lint / format JS     | `./vendor/bin/sail pnpm lint` · `./vendor/bin/sail pnpm format` |
| TS types             | `./vendor/bin/sail pnpm types:check`                            |

Test detail in `docs/testing/index.md`; tooling in `docs/tooling/index.md`.

## Critical rules

- **Always prefix commands with `./vendor/bin/sail`** (see Runtime). This is the most-forgotten rule.
- **Do not edit generated code.** Wayfinder (`resources/js/actions/`, `resources/js/routes/`) and the
  shadcn base UI are excluded from linting; they are regenerated. See `docs/frontend/routing-wayfinder.md`.
- **Domain convention:** code is organized by bounded-context (`App\…\Security\…`). Tests mirror `app/`
  under `tests/Unit` and `tests/Feature`. See `docs/architecture/code-organization.md`.
- **Visible UI text is in English**, hardcoded (no i18n) in `resources/js`. Test titles and comments are
  also in English. Project documentation (`docs/`) is in English.
- **Git hooks run through Sail:** `lefthook` runs the hooks inside Sail. Install them from the HOST with
  `lefthook install`. Pushing directly to `master` is blocked by a hook. See `docs/tooling/git-hooks.md`.
- **Conventional commits** validated by commitlint. The user commits manually: do not run `git commit`
  on their behalf. See `docs/tooling/code-quality.md`.
- **Mandatory quality:** PHPStan at `max` level and 100% type-coverage. Do not lower these thresholds.

## Tooling / MCP / skills

- **Laravel Boost** is installed and exposes an MCP server (`./vendor/bin/sail artisan boost:mcp`,
  declared in `.mcp.json`). It offers semantic docs search, DB schema and logs. Suggested skills in
  `boost.json`. See `docs/ai-tooling/index.md`.

## Where to find more

| Topic                                                  | Path                                   |
| ------------------------------------------------------ | -------------------------------------- |
| Overview + verified stack                              | `docs/index.md`                        |
| Getting started                                        | `docs/getting-started/index.md`        |
| Architecture and bootstrap                             | `docs/architecture/index.md`           |
| Services (DB, cache, storage, mail, search, broadcast) | `docs/services/index.md`               |
| Authentication (Fortify, Sanctum, 2FA, passkeys)       | `docs/authentication/index.md`         |
| Admin panel (Filament)                                 | `docs/admin-panel/index.md`            |
| Frontend (Inertia + React)                             | `docs/frontend/index.md`               |
| Testing (Pest)                                         | `docs/testing/index.md`                |
| Local tooling (hooks, quality)                         | `docs/tooling/index.md`                |
| Continuous integration                                 | `docs/continuous-integration/index.md` |
| AI tooling (Boost/MCP)                                 | `docs/ai-tooling/index.md`             |
| Domain catalog                                         | `docs/domains/index.md`                |
| Documentation conventions                              | `docs/meta/index.md`                   |

Always start at `docs/index.md`.
