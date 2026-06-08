# Starter Template

An opinionated, production-grade starting point for web applications. It ships a complete
authentication and account-management foundation so you can begin building product features on day
one instead of wiring up the basics.

The codebase is intentionally **business-logic free**: the only bounded context is `Security`
(authentication, account settings, admin). Everything else is yours to build.

## Stack

- **Laravel 13** / **PHP 8.5**
- **Filament 5** admin panel (`/admin`)
- **Inertia.js v3** + **React 19** SPA (TypeScript)
- **Fortify** + **Sanctum** authentication: login, registration, password reset, email
  verification, **2FA (TOTP)** and **passkeys (WebAuthn)**
- **Wayfinder** for typed, end-to-end route calls
- **Tailwind CSS v4** with a shadcn-style component base
- **Pest 4** testing (Unit, Feature, Browser, Architecture)

Everything runs in **Docker via Laravel Sail**. Services: Postgres, Valkey, Meilisearch, RustFS
(S3), Mailpit, Soketi.

## Requirements

- Docker
- The Sail binary: `./vendor/bin/sail` (a `sail` shell alias is recommended)

> **Rule of thumb:** never run `php`, `artisan`, `composer`, `node`, `pnpm` or `pest` directly.
> Always prefix with `./vendor/bin/sail`. Running outside Sail breaks the environment.

## Getting started

```bash
# 1. Create your environment file
cp .env.example .env

# 2. Bring the containers up
./vendor/bin/sail up -d

# 3. Install dependencies
./vendor/bin/sail composer install
./vendor/bin/sail pnpm install

# 4. Generate the app key and run migrations + seeders
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed

# 5. Start the dev server
./vendor/bin/sail pnpm dev
```

The app is now available at the `APP_URL` set in your `.env`, and the admin panel at `/admin`.

The first admin user is created from the `AUTH_FOUNDER_*` values in your `.env`. Set them before
seeding.

## Essential commands

| Action               | Command                                       |
| -------------------- | --------------------------------------------- |
| Start environment    | `./vendor/bin/sail up -d`                     |
| Dev (Vite)           | `./vendor/bin/sail pnpm dev`                  |
| Build frontend       | `./vendor/bin/sail pnpm build`                |
| Migrate              | `./vendor/bin/sail artisan migrate`           |
| Tests (Unit+Feature) | `./vendor/bin/sail pest`                      |
| A single test        | `./vendor/bin/sail pest --filter="test name"` |
| Static analysis      | `./vendor/bin/sail phpstan analyse`           |
| PHP formatting       | `./vendor/bin/sail pint`                      |
| Lint / format JS     | `./vendor/bin/sail pnpm lint`                 |
| TS types             | `./vendor/bin/sail pnpm types:check`          |

## Project layout

Code is organized by **bounded context** (e.g. `App\…\Security\…`), and the test suite mirrors
`app/` under `tests/Unit` and `tests/Feature`. Add new features as their own context alongside
`Security`.

```
app/            Application code, grouped by bounded context
resources/js/   Inertia + React frontend (pages, components)
routes/         web.php, api.php
database/       Migrations, factories, seeders
tests/          Pest tests (Unit, Feature, Browser, Arch)
docs/           Full documentation — start at docs/index.md
```

## Quality gates

The template enforces a high quality bar out of the box, run on every push via Git hooks and in CI:

- PHPStan at `max` level and **100% type coverage**
- Pint (PHP) and ESLint + Prettier (JS/TS) formatting
- Conventional Commits (validated by commitlint)
- Pest test suites: Unit, Feature, Browser, Architecture

## Documentation

All project documentation lives in [`docs/`](docs/index.md). Start at
[`docs/index.md`](docs/index.md). AI agents should read [`AGENTS.md`](AGENTS.md) first.

## License

Open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
