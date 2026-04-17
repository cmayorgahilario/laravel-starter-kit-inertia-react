---
title: Developer Tools
description: Telescope request profiling, IDE Helper code intelligence, and the shared dev-only provider gating pattern used by both packages.
---

# Developer Tools

This project ships two developer-facing tools — Laravel Telescope and Laravel IDE Helper — both installed as `require-dev` dependencies and activated exclusively in the `local` environment. Neither is auto-discovered by the framework; both are registered conditionally in `AppServiceProvider` using the same guard pattern.

## Telescope

[Laravel Telescope](https://laravel.com/docs/telescope) is a debug assistant that records every request, query, job, exception, log entry, and more into a local database so you can inspect them through a web UI.

### Dashboard

The dashboard is available at `/telescope` and is only accessible in the `local` environment. Attempting to reach it in any other environment returns a 403.

### Master Switch

A single env var controls whether Telescope collects data at all:

```bash
TELESCOPE_ENABLED=true   # default — set to false to pause recording without removing the package
```

### Watchers

Telescope records data through individual watchers. All 18 watchers are enabled by default:

| Watcher           | What it records                                          |
|-------------------|----------------------------------------------------------|
| `Batch`           | Queued batch job dispatches and status                   |
| `Cache`           | Cache hits, misses, writes, and forgets                  |
| `ClientRequest`   | Outgoing HTTP requests via Laravel's HTTP client         |
| `Command`         | Artisan commands and their exit codes                    |
| `Dump`            | `dump()` / `dd()` calls                                  |
| `Event`           | Dispatched events and their listeners                    |
| `Exception`       | Unhandled exceptions and stack traces                    |
| `Gate`            | Policy and Gate authorization checks                     |
| `Job`             | Queued jobs, attempts, and failures                      |
| `Log`             | Log entries at all severity levels                       |
| `Mail`            | Outgoing mail with headers and rendered content          |
| `Model`           | Eloquent model events (created, updated, deleted)        |
| `Notification`    | Sent notifications                                       |
| `Query`           | SQL queries, bindings, and execution time                |
| `Redis`           | Redis commands                                           |
| `Request`         | Incoming HTTP requests with headers and response payload |
| `Schedule`        | Scheduled command runs                                   |
| `View`            | Rendered Blade views                                     |

Each watcher can be individually disabled via its own env var (e.g., `TELESCOPE_QUERY_WATCHER=false`).

### Toolbar

The Telescope Toolbar renders an inline debug overlay directly on page responses — similar to Symfony's web profiler bar. It is opt-in and disabled by default:

```bash
TELESCOPE_TOOLBAR_ENABLED=false   # default — set to true to enable the overlay
```

The toolbar requires Telescope to be active (`TELESCOPE_ENABLED=true`). The `fruitcake/laravel-telescope-toolbar` package must also be in the `local` environment for the toolbar service provider to load.

### Prune Schedule

Telescope entries accumulate in the database. A daily prune job keeps the table from growing unboundedly:

```php
// routes/console.php
Schedule::command('telescope:prune --hours=48')->daily();
```

Entries older than 48 hours are deleted automatically. Adjust `--hours` in `routes/console.php` if you need a longer or shorter retention window.

### Production Behaviour

Telescope is disabled in production by design. The provider registration is wrapped in an `environment('local')` check, so the package never loads outside of local development — no performance overhead, no data collection, no dashboard exposure.

---

## IDE Helper

[Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper) generates static analysis stubs that give IDEs accurate type information for facades, models, and the container.

### Generated Files

The package produces three files, all of which are gitignored:

| File                    | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `_ide_helper.php`       | Facade method stubs — maps `Auth::user()` to the real return type, etc. |
| `_ide_helper_models.php`| PHPDoc blocks for Eloquent model attributes and relationships            |
| `.phpstorm.meta.php`    | PhpStorm meta file for container resolution type hints                  |

### Manual Commands

Run these when you need to regenerate stubs after adding facades, models, or container bindings:

```bash
# Facade stubs
vendor/bin/sail artisan ide-helper:generate

# Model PHPDoc stubs (--nowrite keeps docs in _ide_helper_models.php, not the model file)
vendor/bin/sail artisan ide-helper:models --nowrite

# PhpStorm meta file
vendor/bin/sail artisan ide-helper:meta
```

The `--nowrite` flag on `ide-helper:models` is intentional: it places the generated PHPDoc in the separate `_ide_helper_models.php` file rather than modifying your model source files directly. This keeps generated content out of version control.

### Auto-Regeneration

The stubs are regenerated automatically after every `composer update` or `composer install` via `post-update-cmd` hooks in `composer.json`:

```json
"post-update-cmd": [
    "@php artisan ide-helper:generate --ansi",
    "@php artisan ide-helper:models --nowrite --ansi",
    "@php artisan ide-helper:meta --ansi"
]
```

You rarely need to run the commands manually — pulling new changes and running `composer install` is enough.

---

## Dev-Only Provider Gating Pattern

Both Telescope and IDE Helper follow the same three-step pattern to ensure they never load outside of local development.

### Step 1 — `require --dev`

The packages are declared under `require-dev` in `composer.json`, so they are not installed in production.

### Step 2 — `dont-discover`

Auto-discovery is disabled for all three providers:

```json
"extra": {
    "laravel": {
        "dont-discover": [
            "barryvdh/laravel-ide-helper",
            "laravel/telescope",
            "fruitcake/laravel-telescope-toolbar"
        ]
    }
}
```

This prevents the framework from loading any of them automatically — even in environments where the package is physically present.

### Step 3 — Conditional Registration in `AppServiceProvider`

The providers are registered manually inside an `environment('local')` + `class_exists()` guard in `AppServiceProvider::register()`:

```php
public function register(): void
{
    if ($this->app->environment('local')) {
        if (class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        if (class_exists(\Fruitcake\TelescopeToolbar\ToolbarServiceProvider::class)) {
            $this->app->register(\Fruitcake\TelescopeToolbar\ToolbarServiceProvider::class);
        }

        if (class_exists(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class)) {
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
        }
    }
}
```

The `class_exists()` check is a safety net for environments where `require-dev` dependencies are skipped (e.g., `composer install --no-dev`). Without it, the `register()` call would throw a fatal error if the class is absent.

### Adding New Dev-Only Tools

Follow the same three steps when adding any new developer tool:

1. Install with `composer require --dev vendor/package`.
2. Add the package to the `dont-discover` array in `composer.json`.
3. Register its service provider inside the `environment('local')` + `class_exists()` guard in `AppServiceProvider::register()`.
