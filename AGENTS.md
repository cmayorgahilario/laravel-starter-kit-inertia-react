# Agent Brief

This file is the minimal brief for AI coding agents working in this repo. It covers only the rules that must be applied from the first turn. Every other detail — stack, commands, conventions — lives in [`docs/`](./docs/index.md). Follow the links when you need more.

## Runtime

- **PHP 8.5 / Laravel 13 inside Laravel Sail (Docker).** Every PHP, Artisan, Composer, Node, or Bun command must be prefixed with `vendor/bin/sail`. Running `php`, `composer`, or `bun` directly on the host is wrong.
- Full service topology, ports, and environment drivers: [`docs/architecture/`](./docs/architecture/index.md).
- Clone / boot / health-check walkthrough: [`docs/getting-started/`](./docs/getting-started/index.md).

## Essential Commands

All commands run through Sail. The container must be up (`vendor/bin/sail up -d`) before most of these work.

### Artisan

```bash
vendor/bin/sail artisan migrate                          # run migrations
vendor/bin/sail artisan migrate:fresh --seed             # reset + seed (local only)
vendor/bin/sail artisan route:list --except-vendor       # inspect app routes
vendor/bin/sail artisan config:show database.default     # verify active driver
vendor/bin/sail artisan tinker                           # REPL (prefer `laravel-boost/database-query` for reads)
vendor/bin/sail artisan make:model Models/Foo/Bar --no-interaction
```

### Composer scripts

```bash
vendor/bin/sail composer run dev         # server + queue + pail + vite, concurrent
vendor/bin/sail composer test            # Pest, compact output
vendor/bin/sail composer test:coverage   # enforces 100% code coverage
vendor/bin/sail composer test:types      # enforces 100% type coverage
vendor/bin/sail composer test:pao        # PAO printer (agent-friendly output)
vendor/bin/sail composer lint            # Pint (write)
vendor/bin/sail composer lint:test       # Pint (check only)
vendor/bin/sail composer refactor        # Rector dry-run
vendor/bin/sail composer refactor:apply  # Rector write
vendor/bin/sail composer types           # Larastan / PHPStan
vendor/bin/sail composer check-all       # lint:test + refactor + types + test
```

After modifying PHP, run `vendor/bin/sail bin pint --dirty` (or `composer lint`) before committing.

### Bun / frontend

```bash
vendor/bin/sail bun install              # install JS deps
vendor/bin/sail bun run dev              # Vite dev server (HMR on :5173)
vendor/bin/sail bun run build            # production client build
vendor/bin/sail bun run build:ssr        # SSR bundle to bootstrap/ssr/ssr.js
vendor/bin/sail bun run lint             # vp fmt + vp lint --fix
vendor/bin/sail bun run test:lint        # lint check only
vendor/bin/sail bun run test:types       # tsc --noEmit
vendor/bin/sail bun run storybook        # Storybook on :6006
```

### Tests (Pest 4)

```bash
vendor/bin/sail artisan test --compact                       # full suite
vendor/bin/sail artisan test --compact --testsuite=Arch      # arch rules only
vendor/bin/sail artisan test --compact --filter=homepage     # single test by name
```

### Git hooks (host, not container)

```bash
bunx lefthook install    # one-time, runs on the host since git invokes hooks there
```

Deeper reference (what each tool does, why it's wired that way, edge cases): [`docs/tooling/`](./docs/tooling/index.md) and [`docs/testing/`](./docs/testing/index.md).

## MCP Servers

`.mcp.json` declares four servers: `laravel-boost`, `context7`, `tavily`, `jina`. Only `laravel-boost` is guaranteed available — the other three need API keys exported in the user's shell and may be disconnected. Do not retry a server that returned a connection/auth/`tool not found` error; fall back per the priority in [`docs/tooling/mcp-servers.md`](./docs/tooling/mcp-servers.md).

**CRITICAL: Always use `laravel-boost/search-docs` before writing or modifying Laravel code. Do not rely on training data for Laravel APIs.**

Priority when choosing an MCP:

1. **This app's runtime state or Laravel-ecosystem docs** → `laravel-boost` first.
2. **Third-party library / framework API docs** → `context7`, then `tavily`/`jina` against the official site.
3. **General web search** → `tavily` first, `jina/search_web` fallback.
4. **Read a specific URL** → `jina/read_url` first, `tavily/tavily_extract` fallback.
5. **Scholarly / PDF / screenshots / images** → `jina` only (no fallback).
6. **Site crawl / sitemap** → `tavily` only (no fallback).

Laravel Boost tools used in place of manual alternatives (full list and usage patterns in [`docs/tooling/mcp-servers.md`](./docs/tooling/mcp-servers.md)):

- `search-docs` · `database-query` · `database-schema` · `get-absolute-url` · `browser-logs` · `last-error` · `read-log-entries` · `application-info`

## Boost Skills

Skills published via `boost.json`: `laravel-best-practices`, `tailwindcss-development`. Activate the matching skill whenever working in those domains.

## Where to Find More

| Topic                                              | Go to                                                                       |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| Docker services, ports, environment drivers        | [`docs/architecture/`](./docs/architecture/index.md)                        |
| What `AppServiceProvider::boot()` wires up         | [`docs/architecture/app-configuration.md`](./docs/architecture/app-configuration.md) |
| `App\Models\{Domain}` conventions                  | [`docs/architecture/domain-namespaces.md`](./docs/architecture/domain-namespaces.md) |
| Vite plugins, Inertia resolver, SSR, React Compiler | [`docs/frontend/`](./docs/frontend/index.md)                                |
| shadcn/ui · Storybook · Theming (Tailwind v4 oklch) | [`docs/frontend/`](./docs/frontend/index.md)                                |
| Fortify auth (Actions, 2FA, rate limiters)         | [`docs/authentication/`](./docs/authentication/index.md)                    |
| Pest 4 conventions, arch tests, browser tests      | [`docs/testing/`](./docs/testing/index.md)                                  |
| MCP fallbacks, quotas, API keys                    | [`docs/tooling/mcp-servers.md`](./docs/tooling/mcp-servers.md)              |
| Telescope · IDE Helper · dev-only provider gating  | [`docs/tooling/developer-tools.md`](./docs/tooling/developer-tools.md)      |
| Lefthook-managed pre-commit & commit-msg checks    | [`docs/tooling/git-hooks.md`](./docs/tooling/git-hooks.md)                  |
| Pint · Larastan · Rector · Pest arch rules         | [`docs/tooling/static-analysis.md`](./docs/tooling/static-analysis.md)      |
| Queue · Search (Typesense) · File Storage · Mail · Realtime · API · Authorization · Database · Deployment | Matching section in [`docs/`](./docs/index.md) |
| How these docs are authored / structured          | [`docs/meta/`](./docs/meta/index.md)                                        |

When in doubt, start at [`docs/index.md`](./docs/index.md) and navigate from there.
