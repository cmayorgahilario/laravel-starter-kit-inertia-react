---
title: Recommended Packages
description: Curated third-party packages worth considering on top of this starter kit — grouped by concern, with the reasoning for each.
---

# Recommended Packages

This page is a curated shortlist of packages that pair well with this starter kit (Laravel 13, Inertia v3, React 19, PostgreSQL 18, Typesense, rustfs/S3). None of them are installed by default — each ships with a trade-off that should be revisited per project. The "why" column captures the non-obvious reason to choose it over rolling your own.

Status legend:

- **recommended** — pick this first when the concern comes up; no realistic competitor in the ecosystem.
- **optional** — clear fit for some projects, skip for others.
- **evaluate** — strong candidate but decision depends on project scale or existing tooling.

For authorization (`spatie/laravel-permission` vs `silber/bouncer`), see [Authorization → Choosing a Package](../authorization/package-comparison.md).

## API & data shaping

| Package | Status | Why |
| --- | --- | --- |
| [`spatie/laravel-query-builder`](https://github.com/spatie/laravel-query-builder) | recommended | Translates JSON:API-style query strings (`?filter[name]=…&sort=-created_at&include=posts`) into safe Eloquent queries. Skip hand-written filter chains in controllers and the footgun of exposing raw `where()` to clients. |
| [`spatie/laravel-data`](https://github.com/spatie/laravel-data) | recommended | Typed DTOs that double as form requests, API resources, and TypeScript-transformable payloads. Pairs naturally with Inertia shared props — a single `Data` class can render to JSON and to a TypeScript type for the React layer. Replaces ad-hoc array-shaping in controllers. |

## Eloquent model behaviors

| Package | Status | Why |
| --- | --- | --- |
| [`spatie/laravel-sluggable`](https://github.com/spatie/laravel-sluggable) | recommended | Auto-generates URL slugs from a source column with collision handling. Trait-based, zero controller code. The uniqueness logic (appending `-2`, `-3`) is the part that is error-prone to reimplement. |
| [`spatie/eloquent-sortable`](https://github.com/spatie/eloquent-sortable) | recommended | Stable `order_column` management for drag-and-drop lists. Handles the reorder-many-at-once case correctly under concurrent writes — which is the bit that naïve `position++` implementations get wrong. |
| [`spatie/laravel-tags`](https://github.com/spatie/laravel-tags) | optional | Polymorphic tags with types and translations. Use when tags need UI affordances (autocomplete, type-scoped namespaces); otherwise a pivot table is fine. |
| [`cybercog/laravel-love`](https://github.com/cybercog/laravel-love) | evaluate | Reactions/likes across multiple reacter types (users, teams). Overkill for a simple "like" button; the right choice when reactions have multiple weights or multiple target models. |

## Media & file handling

| Package | Status | Why |
| --- | --- | --- |
| [`spatie/laravel-medialibrary`](https://github.com/spatie/laravel-medialibrary) | recommended | Associates media collections with any Eloquent model, handles conversions (thumbnails, responsive images) via queued jobs, and integrates with Laravel filesystems — meaning it writes to the project's rustfs/S3 disk with no extra wiring. |
| [`intervention/image`](https://image.intervention.io/v2) | recommended | Low-level image manipulation (resize, crop, encode). Medialibrary depends on it for conversions; also useful directly for one-off transformations that don't need a full media collection. |
| [`spatie/laravel-pdf`](https://github.com/spatie/laravel-pdf) | optional | PDF generation from Blade views via headless Chromium (Browsershot). Best-in-class output fidelity. Requires a Chromium binary on the host — the starter kit already ships one for Pest browser tests, so the marginal cost is near zero. |

## Import / export

| Package | Status | Why |
| --- | --- | --- |
| [`rap2hpoutre/fast-excel`](https://github.com/rap2hpoutre/fast-excel) | recommended | Streams CSV/XLSX reads and writes using constant memory. Default choice when the export is a flat list of rows. ~10× faster than laravel-excel for the simple case. |
| [`maatwebsite/excel`](https://laravel-excel.com/) | evaluate | Heavier, richer: multiple sheets, cell formatting, import validation, chunked jobs. Pick this when the spreadsheet is a document (multi-sheet, styled), not a data dump. |

## Operations & caching

| Package | Status | Why |
| --- | --- | --- |
| [`laravel/horizon`](https://github.com/laravel/horizon) | recommended | Redis queue dashboard and supervisor config. The starter kit already runs `QUEUE_CONNECTION=redis`, so Horizon is the natural operator interface. Adds failure retry ergonomics, metrics, and batch visibility. |
| [`spatie/laravel-backup`](https://github.com/spatie/laravel-backup) | recommended | Scheduled database + filesystem backups to any Laravel disk (including the project's rustfs/S3). Handles retention windows, Slack/email notifications, and monitoring so an unnoticed backup failure doesn't silently accumulate. |
| [`spatie/laravel-responsecache`](https://github.com/spatie/laravel-responsecache) | optional | Full-page HTTP response cache. Good for marketing pages and anonymous-only routes. Not a fit for Inertia-heavy apps where every response is auth-aware — use in addition to, not instead of, per-query caching. |

## Auditing & user experience

| Package | Status | Why |
| --- | --- | --- |
| [`spatie/laravel-activitylog`](https://github.com/spatie/laravel-activitylog) | recommended | Model-level change log (who changed what, when, from what to what). Trait-based, writes to a single `activity_log` table. The cheap version of an audit trail — enable on sensitive models before you need it. |
| [`rappasoft/laravel-authentication-log`](https://github.com/rappasoft/laravel-authentication-log) | optional | Logs login events and new-device notifications per user. Complements Fortify's login flow; useful when "someone logged in from a new device" emails are a product requirement. |
| [`404labfr/laravel-impersonate`](https://github.com/404labfr/laravel-impersonate) | optional | Lets admins log in as another user (support debugging). Respects Laravel's auth pipeline, including Fortify's 2FA. Gate behind a role/permission check. |
| [`laravolt/avatar`](https://github.com/laravolt/avatar) | optional | Generates initial-based placeholder avatars server-side. Cheap fallback when users have no uploaded photo; alternative to Gravatar if you want to avoid third-party image requests. |

## Application patterns

| Package | Status | Why |
| --- | --- | --- |
| [`lorisleiva/laravel-actions`](https://www.laravelactions.com/) | evaluate | Single-class units of work that can be invoked as controllers, jobs, or commands. Reduces the controller/job/service split to one file per use case. Works well with this kit's Fortify Actions pattern; less useful if you prefer classic service classes. |
| [Filament](https://filamentphp.com/) | evaluate | Full admin panel framework (resources, forms, tables, widgets) built on Livewire. Powerful but opinionated — adds a Livewire runtime alongside the Inertia/React front-end. Pick when the admin UI justifies a second rendering stack; otherwise build admin screens in the existing Inertia stack. |

## Not listed here

Authentication (Fortify) and authorization (spatie/laravel-permission vs bouncer) have their own pages:

- [Authentication](../authentication/index.md)
- [Authorization → Choosing a Package](../authorization/package-comparison.md)

Search (Typesense), filesystem (rustfs/S3), queue (Redis), and realtime (Soketi) are infrastructure choices documented under their respective sections — not package recommendations.
