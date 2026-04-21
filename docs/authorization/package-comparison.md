---
title: Choosing an Authorization Package
description: Project-specific decision guide for spatie/laravel-permission vs silber/bouncer — integration points with Security\User, the arch test, Fortify, and Inertia shared props that aren't covered in either package's own documentation.
---

# Choosing an Authorization Package

The two most common role/permission packages in the Laravel ecosystem are [`spatie/laravel-permission`](https://spatie.be/docs/laravel-permission) and [`silber/bouncer`](https://github.com/JosephSilber/bouncer). Both are well-maintained, both are production-proven, and both are a sound choice on paper. This page does **not** restate what their own docs already explain. It focuses on the decision points that are specific to **this project's conventions** — the integration friction you will hit here and the patterns that let you avoid it.

Neither package is installed today (see [Authorization overview](./index.md) for the current baseline). The recommendation at the end is a default, not a mandate — the trade-offs are real and both packages remain viable.

## What each package actually is

| Axis | `spatie/laravel-permission` | `silber/bouncer` |
| ---- | --------------------------- | ---------------- |
| Model | Dedicated `Role` and `Permission` Eloquent models | A single `Ability` concept; roles are a thin grouping over abilities |
| Storage | Five tables (`roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`) | Three tables (`abilities`, `roles`, `assigned_roles` / `permissions`) |
| API style | `$user->assignRole('admin')`, `$user->givePermissionTo('edit posts')` | `Bouncer::allow($user)->to('edit', Post::class)` |
| Multi-tenancy | First-class `team_id` column | Manual scoping via `Bouncer::scope()->to($tenantId)` |
| Caching | Permissions cached by default; `Spatie\Permission\PermissionRegistrar` manages invalidation | No built-in caching — relies on database queries per check |
| Wildcard / super-admin | Manual via `Gate::before` | Built-in `Bouncer::allow($user)->everything()` |
| Entity-level permissions (row-level) | Possible but awkward (stored as separate rows) | Native — abilities can target a specific model instance |

Read their own docs for the full API surface. The rest of this page is about **this** repo.

## The `App\Models\Security\User` override

The user model in this project lives at `App\Models\Security\User` (see `app/Models/Security/User.php`) — not the Laravel default `App\Models\User`. Both packages assume the default namespace in their quickstart examples. Neither will work out of the box without an adjustment:

- **Spatie** — set `auth.providers.users.model` in `config/auth.php` (already correct in this repo), then publish `config/permission.php` and confirm it references the same guard. The package's `HasRoles` trait is added to the `Security\User` model itself — no namespace surgery needed, but every example in the Spatie docs that writes `App\Models\User` has to be mentally rewritten to `App\Models\Security\User`.
- **Bouncer** — mostly namespace-agnostic because it uses polymorphic relations keyed on the model's FQCN. The one gotcha is that `Bouncer::allow($user)->to(...)` stores the polymorphic type as `App\Models\Security\User` in the `assigned_roles` table. If you ever rename the namespace (D033 keeps domain boundaries stable, but this is worth knowing), you must also rewrite the stored type strings.

Net: **both are easy to adapt**, but the friction is front-loaded in the Spatie examples because its documentation is more prescriptive about class locations.

## The arch test constraint

`tests/Arch/ModelsTest.php` enforces that `App\Models\*` are only imported from expected namespaces (controllers, actions, factories, seeders, policies, jobs, providers, and other models). **`App\Http\Requests` is not on that list** — the same constraint that forced `ProfileUpdateRequest` to use `Rule::unique('security_users', 'email')` instead of `Rule::unique(User::class, 'email')` (see `KNOWLEDGE.md` entry "Rule::unique() in Form Requests Must Use Table Name String").

This will bite whichever package you pick:

- **Spatie** — if you ever want a validation rule like `Rule::exists(Role::class, 'name')` in a form request, the arch test will fail on the import. Use the table name instead: `Rule::exists('roles', 'name')`.
- **Bouncer** — same story with `Rule::exists('abilities', 'name')` or `Rule::exists('roles', 'name')`.

Neither package's own docs mention this because the constraint is project-local. Plan for table-name string references anywhere an import would cross an arch boundary.

## Integration with Fortify

Fortify is handling authentication (see [Authentication](../authentication/index.md)). Authorization sits **on top** of Fortify — neither package conflicts with Fortify's routes, rate limiters, or Action classes. The only integration point is the `app/Actions/Fortify/CreateNewUser.php` Action, which currently just creates a user with `name`, `email`, and `password`. Once either package is installed, this is where you would assign a default role (`$user->assignRole('member')` for Spatie, `Bouncer::assign('member')->to($user)` for Bouncer).

Nothing in `config/fortify.php`, `app/Providers/FortifyServiceProvider.php`, or the Fortify rate limiters needs to change.

## Integration with Inertia shared props

This is the biggest project-specific consideration, and neither package documents it (because it is framework-adjacent, not framework-specific).

`app/Http/Middleware/HandleInertiaRequests.php` shares `auth.user` with every page. Today it exposes `id`, `name`, `email`. Once authorization exists, React pages need to know **what the current user can do** so they can hide buttons, disable menu items, and render conditional UI. There is no Blade-equivalent `@can` directive on the React side — the check has to be a boolean or a list passed via props.

Two viable shapes:

```php
// Spatie — expose role names and a flat permissions list
'auth' => fn () => [
    'user' => $request->user() ? [
        'id'          => $request->user()->id,
        'name'        => $request->user()->name,
        'email'       => $request->user()->email,
        'roles'       => $request->user()->getRoleNames(),           // Collection<string>
        'permissions' => $request->user()->getAllPermissions()       // Collection<Permission>
                            ->pluck('name'),
    ] : null,
],
```

```php
// Bouncer — expose roles and a computed ability list
'auth' => fn () => [
    'user' => $request->user() ? [
        'id'        => $request->user()->id,
        'name'      => $request->user()->name,
        'email'     => $request->user()->email,
        'roles'     => $request->user()->getRoles(),                 // array<string>
        'abilities' => $request->user()->getAbilities()              // Collection<Ability>
                            ->pluck('name'),
    ] : null,
],
```

Both shapes then require a matching augmentation in `resources/js/types/global.d.ts` (the `@inertiajs/core` module, per D042 — see `docs/frontend/index.md`). A React helper such as `usePermissions()` or `useAbilities()` reads the shared prop and returns a memoized predicate:

```ts
// pseudo-signature — not a file in this repo yet
function useCan(permission: string): boolean;
```

**Performance watch-out:** on every request, the shared-prop closure runs once. If `$request->user()->getAllPermissions()` (Spatie) or `$request->user()->getAbilities()` (Bouncer) issues unbounded queries, you pay that cost per request. Spatie's built-in `PermissionRegistrar` cache mitigates this; Bouncer does not cache, so a request-scoped memoization or an explicit cache layer is something to plan for.

## Integration with the `security_users` rename

Migration `0001_01_01_000000_create_security_users_table.php` renames the default `users` table to `security_users` (see `KNOWLEDGE.md` entry "Laravel Sees Renamed Migration DB Record"). Both packages ship their own migrations that reference `users` by name for the foreign key on the pivot tables:

- **Spatie** — `config/permission.php` has a `table_names` array **and** a `column_names.model_morph_key` setting. The foreign key on `model_has_roles` and `model_has_permissions` points at the authenticated model's table. Set `column_names.team_foreign_key`, `table_names.*`, and (critically) the morph map so stored type strings do not bake in the `App\Models\User` default.
- **Bouncer** — uses polymorphic `entity_id` + `entity_type` columns, so it is agnostic to the users table name. No override required.

This is a small but real edge on Bouncer's side for this specific repo — one less configuration step to get wrong.

## Testing ergonomics

Pest tests in this repo use `LazilyRefreshDatabase` globally (see `tests/Pest.php`). Authorization state lives in database tables for both packages, so test setup requires seeding roles/abilities before `actingAs($user)`:

- **Spatie** — requires resetting the permission cache between tests: `app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions()` in `beforeEach`. Otherwise, permissions created in one test leak into the next via the in-memory cache, producing false positives.
- **Bouncer** — no shared cache, so tests are self-contained without extra setup. Seeding is the only step.

If you go with Spatie, add the cache-forget to the `Pest.php` `beforeEach` for any test group that touches permissions — the failure mode (tests that pass in isolation but fail in sequence) is infuriating to debug.

## When to pick which

Pick **`spatie/laravel-permission`** when:

- You want a conventional, widely-recognized role/permission model that new contributors will already know.
- You expect the permission set to grow large (hundreds of distinct permissions) — the built-in cache matters at that scale.
- You prefer the `$user->can('edit-posts')` style over ability-centric APIs.
- Multi-tenancy with a `team_id` column is a near-term requirement.

Pick **`silber/bouncer`** when:

- You want row-level / entity-level permissions (a user can edit **this specific post**, not all posts). Bouncer makes this native; Spatie makes it awkward.
- You prefer a terser API (`Bouncer::allow($user)->to('edit', $post)`).
- You want to skip the morph-map + table-name gymnastics imposed by this repo's `security_users` rename.
- You do not need a built-in cache (small permission sets, or you will add caching yourself).

## Default recommendation

If neither of the "pick Bouncer" criteria above apply, start with **`spatie/laravel-permission`**. The ecosystem familiarity and the built-in cache are real advantages, and the integration friction with this repo (morph map, `Rule::exists` with table strings, permission-cache reset in tests) is all one-time setup cost that this page now documents.

Record the choice as a Decision (`D###`) when the package is installed, with a link back to this page for the rationale.

## Open questions for when the decision is made

These are deliberately left unanswered — they require the package to be installed and a concrete use case to measure against:

- Is a `team_id` column expected in the first milestone that uses authorization, or can multi-tenancy wait? (Spatie makes this trivial; Bouncer makes it manual.)
- Will the permission set be enumerable at config time (seeder-driven) or dynamic (created by admins at runtime)?
- Should the `auth.user` shared prop expose raw role/permission names, or a pre-computed `can` object? The latter is safer against name drift but less flexible.

These questions belong in the milestone that introduces authorization — not here.
