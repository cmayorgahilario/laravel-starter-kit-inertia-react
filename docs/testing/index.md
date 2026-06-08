---
title: Testing
description: Pest 4 suites, helpers, the test environment and how to run each kind of test.
---

# Testing

**Why it exists:** explain how the test suite is organized and how to run it — the cross-cutting testing
conventions, not the one-off "how to test feature X".
**Covers:** the Pest setup, the four test suites, the testing environment, shared helpers and the
commands.
**Does not cover:** the code organization those tests mirror (see
[../architecture/code-organization.md](../architecture/code-organization.md)) or the static-analysis
tooling (see [../tooling/index.md](../tooling/index.md)).

## Overview

Tests use **Pest 4** with several plugins: `pest-plugin-laravel`, `pest-plugin-browser`,
`pest-plugin-livewire`, `pest-plugin-profanity` and `pest-plugin-type-coverage` (`composer.json`).
Configuration is in `phpunit.xml`; bootstrap and helpers in `tests/Pest.php`.

## Suites

`phpunit.xml` defines four suites:

| Suite   | Directory       | Purpose                                                 |
| ------- | --------------- | ------------------------------------------------------- |
| Unit    | `tests/Unit`    | Isolated unit tests (e.g. models).                      |
| Feature | `tests/Feature` | HTTP, controllers, Filament resources, middleware.      |
| Browser | `tests/Browser` | End-to-end browser tests (Playwright).                  |
| Arch    | `tests/Arch`    | Architecture/boundary rules (`tests/Arch/Boundaries/`). |

The Feature and Browser trees mirror `app/` (e.g.
`tests/Feature/Filament/Resources/Security/Users/`). Other folders: `tests/Datasets/` (shared datasets)
and `tests/Fixtures/`.

## Test environment

`phpunit.xml` overrides the environment so tests are fast and isolated: `APP_ENV=testing`,
`BCRYPT_ROUNDS=4`, `CACHE_STORE=array`, `QUEUE_CONNECTION=sync`, `SESSION_DRIVER=array`,
`MAIL_MAILER=array`, `FILESYSTEM_DISK=public`, `BROADCAST_CONNECTION=null`.

## Conventions

- Use `test()`, not `it()`. Test titles and inline comments are in English.
- Feature and Browser tests use `RefreshDatabase` (wired in `tests/Pest.php`).
- Filament resources are tested with Livewire component tests plus a per-test authenticated user.
- Shared helpers in `tests/Pest.php`: `loginAsUser()` (factory + auth) and `confirmPasswordInBrowser()`
  (for the password-confirmation flow).

## Commands

| Goal                     | Command                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ |
| Unit + Feature           | `./vendor/bin/sail pest`                                                       |
| A single test            | `./vendor/bin/sail pest --filter="test name"`                                  |
| Architecture             | `./vendor/bin/sail pest --testsuite=Arch`                                      |
| Coverage                 | `./vendor/bin/sail pest --coverage`                                            |
| Coverage gate (CI, 100%) | `./vendor/bin/sail pest --exclude-testsuite=Browser,Arch --coverage --min=100` |
| Type coverage (100%)     | `./vendor/bin/sail pest --type-coverage --min=100`                             |
| Profanity (en, es)       | `./vendor/bin/sail pest --profanity --language=en,es`                          |

These are also exposed as Composer scripts (`test`, `test:arch`, `test:coverage`, `test:coverage:ci`,
`test:type`, `test:profanity`).
