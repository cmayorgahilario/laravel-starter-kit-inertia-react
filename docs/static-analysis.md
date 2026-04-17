---
title: Static Analysis
description: How the project uses Pint, Larastan, and Rector as a three-tool pipeline to enforce code style, type safety, and automated refactoring.
---

# Static Analysis

This project runs three static analysis tools in a deliberate order: **Pint → Larastan → Rector**. Each tool operates on the output left by the previous one, so the order matters and must not be changed.

## Tool Execution Order

| Step | Tool | Purpose |
|---|---|---|
| 1 | **Pint** | Formats code style — enforces strict types, import order, class element order, and dozens of other syntactic rules |
| 2 | **Larastan** | Runs PHPStan level 9 type analysis — requires fully-qualified imports and strict types to be present before analysis |
| 3 | **Rector** | Applies automated refactors — works on already-formatted, already-typed code so its output remains clean |

Running tools out of order causes problems: Rector may introduce code that Pint would then reformat, requiring a second pass. Running Larastan before Pint may produce errors on code that Pint would have fixed anyway.

## Composer Commands

All static analysis commands are exposed as Composer scripts so they work identically inside and outside Sail:

| Command | Script | What it does |
|---|---|---|
| `composer lint` | `vendor/bin/pint` | Formats all PHP files in place |
| `composer lint:test` | `vendor/bin/pint --test` | Checks formatting without writing changes (CI-safe) |
| `composer refactor` | `vendor/bin/rector --dry-run` | Shows what Rector would change without applying |
| `composer refactor:apply` | `vendor/bin/rector` | Applies Rector refactors in place |
| `composer types` | `vendor/bin/phpstan analyse --memory-limit=512M` | Runs Larastan type analysis |
| `composer check-all` | Chains four scripts | Runs the full pipeline in order |

### check-all Chain

The `check-all` script runs the tools in their correct order:

```bash
vendor/bin/sail composer check-all
```

Internally it runs: `lint:test` → `refactor` → `types` → `test`

This sequence uses `lint:test` (read-only) rather than `lint` so no files are modified mid-chain. If any step fails, the chain stops immediately.

## Pint Configuration

Pint is configured in `pint.json` at the project root. It uses the `laravel` preset as a base and extends it with additional rules.

### Preset

```json
{
    "preset": "laravel"
}
```

The `laravel` preset enforces Laravel's official code style, including PSR-12 compliance, spacing, and naming conventions.

### Key Rules

| Rule | Value | Purpose |
|---|---|---|
| `declare_strict_types` | `true` | Injects `declare(strict_types=1)` at the top of every PHP file |
| `ordered_class_elements` | custom order | Enforces a consistent member ordering within classes |
| `strict_comparison` | `true` | Replaces `==` with `===` throughout the codebase |
| `fully_qualified_strict_types` | `true` | Ensures imported types use fully-qualified names where required |
| `global_namespace_import` | classes + constants + functions | Adds `use` statements instead of inline FQCNs |
| `mb_str_functions` | `true` | Replaces `str_*` with `mb_str_*` equivalents |
| `modernize_types_casting` | `true` | Replaces `intval()`, `strval()` etc. with `(int)`, `(string)` casts |
| `protected_to_private` | `true` | Narrows visibility from `protected` to `private` where possible |

### Disabled Final Rules

Three `final` rules from the Laravel preset are explicitly disabled:

| Rule | Reason |
|---|---|
| `final_class` | Would make all classes final, breaking extensibility |
| `final_internal_class` | Same — too aggressive for a starter kit |
| `final_public_method_for_abstract_class` | Conflicts with test patterns that extend abstract classes |

### Excluded Path

`tests/TestCase.php` is excluded from Pint processing via `notPath` to avoid conflicts with PHPUnit's base class requirements.

### Full Configuration

```json
{
    "preset": "laravel",
    "notPath": [
        "tests/TestCase.php"
    ],
    "rules": {
        "array_push": true,
        "backtick_to_shell_exec": true,
        "date_time_immutable": true,
        "declare_strict_types": true,
        "lowercase_keywords": true,
        "lowercase_static_reference": true,
        "final_class": false,
        "final_internal_class": false,
        "final_public_method_for_abstract_class": false,
        "fully_qualified_strict_types": true,
        "global_namespace_import": {
            "import_classes": true,
            "import_constants": true,
            "import_functions": true
        },
        "mb_str_functions": true,
        "modernize_types_casting": true,
        "new_with_parentheses": false,
        "no_superfluous_elseif": true,
        "no_useless_else": true,
        "no_multiple_statements_per_line": true,
        "ordered_class_elements": {
            "order": [
                "use_trait",
                "case",
                "constant",
                "constant_public",
                "constant_protected",
                "constant_private",
                "property_public",
                "property_protected",
                "property_private",
                "construct",
                "destruct",
                "magic",
                "phpunit",
                "method:casts",
                "method_abstract",
                "method_public_static",
                "method_public",
                "method_protected_static",
                "method_protected",
                "method_private_static",
                "method_private"
            ],
            "sort_algorithm": "none"
        },
        "ordered_interfaces": true,
        "ordered_traits": true,
        "protected_to_private": true,
        "self_accessor": true,
        "self_static_accessor": true,
        "strict_comparison": true,
        "visibility_required": true
    }
}
```

## Larastan Configuration

Larastan wraps PHPStan with Laravel-specific extensions. Configuration lives in `phpstan.neon` at the project root.

### Level

The project runs at **level 9** — the maximum PHPStan strictness level. This means every type must be explicit, no `mixed` is allowed to propagate silently, and all method calls must be provably safe.

### Analysis Paths

PHPStan analyses these five directories:

| Path | Contents |
|---|---|
| `app` | All application code |
| `config` | Configuration files |
| `bootstrap` | Application bootstrap files |
| `database/factories` | Eloquent model factories |
| `routes` | Route definition files |

`tests/` is intentionally excluded — test files use dynamic patterns (closures passed to `test()`) that would generate many false positives.

### Includes

Two NEON files are included:

| Include | Purpose |
|---|---|
| `vendor/larastan/larastan/extension.neon` | Adds Laravel-specific type stubs — teaches PHPStan about Eloquent relationships, facades, config helpers, etc. |
| `vendor/phpstan/phpstan/conf/bleedingEdge.neon` | Opts into upcoming PHPStan rules before they become default — future-proofs type coverage |

### Zero-Baseline Policy

This project does not use a PHPStan baseline file. Every type error must be fixed before it is committed. A baseline would allow errors to accumulate silently over time, defeating the purpose of level 9 analysis.

### Full Configuration

```neon
includes:
    - vendor/larastan/larastan/extension.neon
    - vendor/phpstan/phpstan/conf/bleedingEdge.neon

parameters:
    level: 9

    paths:
        - app
        - config
        - bootstrap
        - database/factories
        - routes
```

## Rector Configuration

Rector applies automated code refactors. Configuration lives in `rector.php` at the project root.

### Dry-Run Default

`composer refactor` runs Rector with `--dry-run` by default — it shows what would change without modifying any files. To apply changes, run `composer refactor:apply` explicitly. This default prevents accidental bulk rewrites during exploration.

### Analysis Paths

Rector processes these four paths:

| Path | Contents |
|---|---|
| `app` | All application code |
| `bootstrap/app.php` | Application bootstrap |
| `database` | Migrations, factories, and seeders |
| `public` | Public-facing entry points |

### Prepared Sets

Six prepared rule sets are enabled:

| Set | What it enforces |
|---|---|
| `deadCode: true` | Removes unreachable code, unused variables, and dead assignments |
| `codeQuality: true` | Simplifies conditions, removes redundant casts, and applies other quality improvements |
| `codingStyle: true` | Normalizes code style patterns not covered by Pint |
| `typeDeclarations: true` | Adds missing parameter and return type declarations |
| `privatization: true` | Narrows class/property/method visibility where possible |
| `earlyReturn: true` | Converts nested conditions to early-return patterns |

### Skipped Rule

One rule from the `Php83` set is explicitly skipped:

```php
->withSkip([
    Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector::class,
])
```

`AddOverrideAttributeToOverriddenMethodsRector` adds `#[Override]` attributes to all overriding methods. This is too noisy in a starter kit context where many methods extend framework base classes — it would clutter every controller, model, and provider with `#[Override]` on routine methods.

### PHP Target

```php
->withPhpSets(php85: true)
```

Rector targets PHP 8.5 features, matching the project's minimum PHP version.

### Full Configuration

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/app',
        __DIR__.'/bootstrap/app.php',
        __DIR__.'/database',
        __DIR__.'/public',
    ])
    ->withSkip([
        Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector::class,
    ])
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        codingStyle: true,
        typeDeclarations: true,
        privatization: true,
        earlyReturn: true,
    )
    ->withPhpSets(php85: true);
```

## Rector Edge Cases

### HasFactory PHPDoc and FQCN Imports

Models using the `HasFactory` trait must reference the factory with a fully-qualified class name in the PHPDoc, not a bare import:

```php
// Correct — FQCN in PHPDoc
/** @use HasFactory<\Database\Factories\UserFactory> */
use HasFactory;

// Wrong — bare class name won't survive Pint's no_unused_imports
/** @use HasFactory<UserFactory> */
use HasFactory;
use Database\Factories\UserFactory; // Pint strips this as unused
```

Pint's `global_namespace_import` rule adds import statements for classes referenced in code. However, PHPDoc-only references are not treated as code-level usages. If `UserFactory` is only mentioned inside a PHPDoc generic parameter, Pint classifies the `use Database\Factories\UserFactory;` statement as unused and removes it on the next lint pass. Larastan then fails because it can no longer resolve `UserFactory`.

The fix is to always write the full `\Database\Factories\UserFactory` path directly inside the PHPDoc template parameter so no import is needed.

### Trait Splitting

When Rector's `privatization` set narrows a method from `protected` to `private`, it can conflict with traits. A method defined in a trait that overrides a `protected` method in a parent class cannot be made `private` — PHP does not allow traits to reduce visibility in this context.

If Rector suggests a visibility change on a trait method that causes a PHP error, add the specific method or class to the `withSkip()` array in `rector.php`:

```php
->withSkip([
    Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector::class,
    // Add specific class::method pairs here if trait privatization causes errors
])
```
