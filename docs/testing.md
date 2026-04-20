---
title: Testing
description: How the project uses Pest 4 for unit, feature, architecture, and browser testing — commands, plugins, and coverage enforcement.
---

# Testing

This project uses [Pest 4](https://pestphp.com/) as its test runner. Pest replaces PHPUnit's class-based syntax with closure-based tests and a fluent `expect()` API while still running on top of PHPUnit 12 under the hood.

## Running Tests

All test commands run through `vendor/bin/sail` so they execute inside the Docker container where the database and other services are available.

| Command                                  | What it does                                                 |
| ---------------------------------------- | ------------------------------------------------------------ |
| `vendor/bin/sail composer test`          | Runs the full suite with compact output                      |
| `vendor/bin/sail composer test:coverage` | Runs the suite and enforces 100% code coverage (`--min=100`) |
| `vendor/bin/sail composer test:types`    | Runs the suite and enforces 100% type coverage (`--min=100`) |
| `vendor/bin/sail composer test:pao`      | Runs the suite with the PAO printer (agent-friendly output)  |

You can also call Artisan directly when you want finer control:

```bash
# Run all tests with compact output
vendor/bin/sail artisan test --compact

# Run only the architecture suite
vendor/bin/sail artisan test --compact --testsuite=Arch

# Run a single test by name
vendor/bin/sail artisan test --compact --filter=homepage
```

## Directory Structure

```
tests/
├── Arch/                       # Architecture rules — one file per domain
│   ├── GlobalTest.php          # Debug/sleep bans, PHP and security presets
│   ├── HttpTest.php            # Controller naming and dependency boundaries
│   ├── ModelsTest.php          # Model inheritance, casts, and usage boundaries
│   └── ProvidersTest.php       # Provider inheritance and dependency boundaries
├── Browser/                    # End-to-end browser tests via Playwright + Chromium
│   └── HomepageTest.php
├── Feature/                    # HTTP-level integration tests against the full app stack
│   ├── Models/                 # Model cast, attribute, and relationship tests
│   │   └── UserTest.php
│   └── Providers/              # Service provider boot behavior tests
│       └── AppServiceProviderTest.php
├── Unit/                       # Pure unit tests with no framework bootstrapping
├── Pest.php                    # Layered bindings: TestCase + RefreshDatabase wiring
└── TestCase.php                # Base test case extending Laravel's TestCase
```

Feature tests mirror the `app/` directory structure — a test for `app/Models/User.php` lives at `tests/Feature/Models/UserTest.php`. Follow this convention when adding new tests.

## Test Configuration (Pest.php)

`tests/Pest.php` wires each suite to the appropriate base class and traits so individual test files stay clean:

```php
<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

pest()->extend(TestCase::class)->use(RefreshDatabase::class)->in('Feature');
pest()->extend(TestCase::class)->in('Browser');
```

- **Feature** tests get `TestCase` (full app bootstrap) and `RefreshDatabase` (database reset per test).
- **Browser** tests get `TestCase` only — `RefreshDatabase` is omitted because Playwright drives a live HTTP server rather than calling the app in-process.
- **Unit** and **Arch** tests have no binding, so they run with minimal overhead.

## Writing Tests

### Unit tests

Unit tests use `expect()` to assert values without booting the framework:

```php
test('that true is true', function () {
    expect(true)->toBeTrue();
});
```

### Feature tests

Feature tests use `$this->get()` and other HTTP helpers provided by `TestCase`:

```php
test('the application returns a successful response', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
});
```

### Architecture tests

Architecture tests use `arch()` to enforce structural rules across the entire codebase:

```php
arch('no debug functions')
    ->expect(['dd', 'dump', 'ray'])
    ->not->toBeUsed();
```

### Browser tests

Browser tests use `$this->visit()` (a trait method injected via `pest-plugin-browser`) to drive a real Chromium instance:

```php
test('homepage title contains app name', function () {
    $this->visit('/')
        ->assertTitleContains('React Starter Kit');
});
```

## Plugins

| Package                             | Version | Purpose                                                                              |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `pestphp/pest-plugin-laravel`       | 4.1.0   | `$this->get()`, `RefreshDatabase`, and other Laravel helpers                         |
| `pestphp/pest-plugin-browser`       | 4.3.1   | `$this->visit()` and Playwright-backed browser assertions                            |
| `pestphp/pest-plugin-livewire`      | 4.1.0   | `livewire()` helper for testing Livewire components                                  |
| `pestphp/pest-plugin-type-coverage` | 4.0.4   | `--type-coverage --min=100` enforcement                                              |
| `pestphp/pest-plugin-profanity`     | 4.2.1   | Blocks profane strings from appearing in test output                                 |
| `nunomaduro/pao`                    | 0.1.8   | PAO printer — structured output readable by AI agents (activated via `CLAUDECODE=1`) |

## Architecture Tests

Architecture tests live in `tests/Arch/`, split into one file per domain following the [Pinkary convention](https://github.com/pinkary-project/pinkary.com/tree/main/tests/Arch). Each file targets a specific `App\` namespace or global concern.

### GlobalTest.php — Language-level rules

| Rule               | What it checks                                                            |
| ------------------ | ------------------------------------------------------------------------- |
| No debug functions | `dd`, `dump`, `ray`, `die`, `var_dump` must not appear in production code |
| No sleep functions | `sleep`, `usleep` must not appear in production code                      |
| PHP preset         | Enforces common PHP best-practice rules from Pest's built-in preset       |
| Security preset    | Enforces security rules from Pest's built-in security preset              |

### ModelsTest.php — Eloquent layer

| Rule                               | What it checks                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Models extend Eloquent model       | Every class in `App\Models` extends `Illuminate\Database\Eloquent\Model` and defines `casts()` |
| Models used in expected namespaces | `App\Models` is only referenced by controllers, providers, factories, and seeders              |

### HttpTest.php — HTTP layer

| Rule                          | What it checks                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------- |
| Controller suffix             | Every class in `App\Http\Controllers` ends with `Controller` and extends nothing |
| Controllers not used directly | No app class imports a controller — only the framework wires them                |

### ProvidersTest.php — Service providers

| Rule                        | What it checks                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------- |
| ServiceProvider suffix      | Every class in `App\Providers` ends with `ServiceProvider` and extends the base class |
| Providers not used directly | No app class imports a provider — only the framework wires them                       |

When adding a new `App\` namespace (e.g. `App\Jobs`, `App\Mail`), create a matching `tests/Arch/{Layer}Test.php` file with inheritance, suffix, and boundary rules.

Run only the architecture suite when iterating on structural rules:

```bash
vendor/bin/sail artisan test --compact --testsuite=Arch
```

## Coverage Enforcement

The project enforces 100% coverage on two axes to prevent gaps from going unnoticed:

- **Code coverage** — `vendor/bin/sail composer test:coverage` runs `--coverage --min=100`. If any line in `app/` is untested the build fails.
- **Type coverage** — `vendor/bin/sail composer test:types` runs `--type-coverage --min=100`. If any parameter or return type is missing the build fails.

The `app/` directory is the coverage source (configured in `phpunit.xml`). Tests themselves are excluded.

## CI Pipeline

CI is composed of one short orchestrator (`ci.yml`) that calls three reusable `workflow_call` files. The orchestrator has no jobs of its own — it delegates everything and passes `secrets: inherit` so reusable workflows can reach any secret the calling repo has in scope.

| File | Purpose | Trigger | Jobs |
| ---- | ------- | ------- | ---- |
| `.github/workflows/ci.yml` | Orchestrator — delegates to reusables with `secrets: inherit` | `push` (all branches) + `pull_request` (main) | none (calls others) |
| `.github/workflows/php-quality.yml` | PHP lint + static analysis | `workflow_call` | `Pint (code style)`, `Larastan (static analysis)` |
| `.github/workflows/js-quality.yml` | JS lint + type check + build | `workflow_call` | `oxlint (JS lint)`, `tsc (type check)`, `build (Vite)` |
| `.github/workflows/pest.yml` | Pest tests + coverage (sharded) | `workflow_call` | `Pest (tests + coverage)` (matrix) |

Design principles:

- Reusable files use `workflow_call` only — they have no `push` or `pull_request` triggers and cannot be run directly.
- The orchestrator passes `secrets: inherit` so downstream workflows can access repo secrets without re-declaring them.
- `js-quality.yml` runs a dual-runtime (PHP + Bun) chain in each job because Wayfinder generates TypeScript type files that are gitignored; they must be regenerated at CI time before linting, type-checking, or building.
- Job display names (`Pint (code style)`, `Larastan (static analysis)`, etc.) are deliberately distinct to support exact-name branch-protection rules.

## Test Sharding

Pest supports splitting the test suite across parallel CI jobs via the `--shard=N/T` flag, where `N` is this shard's 1-based index and `T` is the total number of shards. Each shard runs an independent subset of tests so the full suite completes faster. See the [Pest sharding docs](https://pestphp.com/docs/continuous-integration#content-sharding-your-tests) for the full reference.

The default matrix in `pest.yml` runs a single shard (equivalent to no sharding):

```yaml
strategy:
  fail-fast: false
  matrix:
    shard: ["1/1"]
```

The test step passes the shard value directly to the runner:

```yaml
run: php artisan test --coverage --min=100 --compact --shard=${{ matrix.shard }}
```

### When to scale

Add shards when:

- The Pest job exceeds ~5 minutes wall-clock time and CI feedback loops are blocking developer throughput.
- The test suite grows large enough that a single runner is the bottleneck.

### How to scale

Expanding to five shards is a one-line matrix change:

```yaml
matrix:
  shard: ["1/5","2/5","3/5","4/5","5/5"]
```

`fail-fast: false` is already set, so a failing shard does not cancel its siblings — all shards complete and failures are reported together.

### Rebalancing shards with --update-shards

Pest can emit time-balanced redistribution data to prevent hot-shard skew. Run `--update-shards` locally or in a scheduled job, then commit the updated distribution file so subsequent runs use the new boundaries:

```bash
vendor/bin/sail artisan test --shard=1/5 --update-shards
```

### Branch protection caveat

When the matrix expands, GitHub Actions appends the shard value to the job display name. With the default single shard the required status check is named `Pest (tests + coverage) (1/1)`. Expanding to five shards produces `Pest (tests + coverage) (1/5)` through `Pest (tests + coverage) (5/5)`. Branch-protection rules that require the exact job name must be updated to match the new suffixed names, or switched to a glob or regex pattern that covers all shards.

## Browser Testing

Browser tests use Playwright to drive a real Chromium browser. The browser binary must be installed once per environment:

```bash
# Install the Playwright npm package
vendor/bin/sail bun add -d playwright

# Download the Chromium binary inside the container
vendor/bin/sail exec laravel.test npx playwright install chromium
```

Write browser tests using `$this->visit()` — this is a trait method provided by `pest-plugin-browser`, not a standalone imported function:

```php
test('homepage title contains app name', function () {
    $this->visit('/')
        ->assertTitleContains('React Starter Kit');
});
```

Browser tests live in `tests/Browser/` and are collected by the `Browser` testsuite defined in `phpunit.xml`. They do not reset the database between tests (no `RefreshDatabase`) so they can run against the full live stack.

## PHPUnit XML Configuration

`phpunit.xml` defines four testsuites and sets the coverage source to `app/`:

| Suite   | Directory       |
| ------- | --------------- |
| Unit    | `tests/Unit`    |
| Feature | `tests/Feature` |
| Arch    | `tests/Arch`    |
| Browser | `tests/Browser` |

Key environment overrides set in `phpunit.xml` for test runs:

- `APP_ENV=testing`
- `CACHE_STORE=array` (fast in-memory cache)
- `QUEUE_CONNECTION=sync` (jobs run immediately)
- `SESSION_DRIVER=array`
- `DB_DATABASE=testing`
