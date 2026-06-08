---
title: Admin panel (Filament)
description: The Filament panel at /admin, its providers, access gate and the Users resource.
---

# Admin panel (Filament)

**Why it exists:** document the Filament administration panel — how it is configured, who can access it
and which resources it exposes.
**Covers:** the panel provider, access control, the icon mapping and the `UserResource` (the only
resource today).
**Does not cover:** end-user authentication (see [../authentication/index.md](../authentication/index.md))
or the Inertia SPA (see [../frontend/index.md](../frontend/index.md)).

## Overview

The admin panel is built with **Filament 5**, configured in
`App\Providers\Filament\PanelServiceProvider`. It is independent from the Inertia SPA: it has its own
routes, its own theme and its own auth gate.

| Setting                  | Value                                    | Source                 |
| ------------------------ | ---------------------------------------- | ---------------------- |
| Panel id                 | `admin`                                  | `PanelServiceProvider` |
| Path                     | `/admin`                                 | `PanelServiceProvider` |
| Primary color            | Amber                                    | `PanelServiceProvider` |
| Resources auto-discovery | `app/Filament/Resources`                 | `PanelServiceProvider` |
| Pages auto-discovery     | `app/Filament/Pages`                     | `PanelServiceProvider` |
| Widgets auto-discovery   | `app/Filament/Widgets`                   | `PanelServiceProvider` |
| Registered widgets       | `FilamentInfoWidget`                     | `PanelServiceProvider` |
| Theme                    | `resources/css/filament/admin/theme.css` | `PanelServiceProvider` |

## Access control

The `User` model implements `FilamentUser`. Access to `/admin` is granted only to users with a verified
email (`canAccessPanel()` on `App\Models\Security\User`). The shared Inertia prop `can_access_admin`
reflects this gate for the frontend (see [../architecture/app-bootstrap.md](../architecture/app-bootstrap.md)).

## Icons

`App\Providers\Filament\IconServiceProvider` maps Lucide icons (via `codewithdennis/filament-lucide-icons`)
to Filament's UI slots (actions, forms, tables, widgets…), so the panel uses Lucide consistently.

## Widgets

The panel registers Filament's `FilamentInfoWidget` and auto-discovers widgets from
`app/Filament/Widgets`. The only custom one is `BackToAppWidget`
(`app/Filament/Widgets/BackToAppWidget.php`, sort `-3` so it renders first): a card linking back to the
SPA dashboard (`route('dashboard')`). Filament's default `AccountWidget` is intentionally not
registered.

## Worked example: UserResource

`App\Filament\Resources\Security\Users\UserResource` manages users. Its pieces are split by
responsibility:

```text
app/Filament/Resources/Security/Users/UserResource.php   // model, slug, navigation, icon
app/Filament/Resources/Security/Users/Schemas/UserForm.php      // create/edit form
app/Filament/Resources/Security/Users/Schemas/UserInfolist.php  // view (read-only) layout
app/Filament/Resources/Security/Users/Tables/UsersTable.php     // list columns, filters, actions
app/Filament/Resources/Security/Users/Pages/                    // List/Create/View/Edit pages
```

| Aspect           | Value                      |
| ---------------- | -------------------------- |
| Model            | `App\Models\Security\User` |
| URL slug         | `security/users`           |
| Navigation group | `Security`                 |
| Record title     | `name`                     |
| Icon             | `LucideIcon::Users`        |

**Key points:**

- Form/table/infolist are separate classes (Filament 5 schema style), not inline in the resource.
- The form handles avatar upload (image editor), unique email (ignoring the current record) and a
  hashed, required-on-create password.
- The table supports search/sort, a verified/unverified filter, a `created_at` range filter and a bulk
  delete; default order is `created_at` descending.

## Adding a new resource

```bash
./vendor/bin/sail artisan make:filament-resource Catalog/Product
```

Place it under the domain namespace (`app/Filament/Resources/<Domain>/...`) following
[../architecture/code-organization.md](../architecture/code-organization.md), and mirror its tests under
`tests/Feature/Filament/Resources/<Domain>/`.

## What NOT to do

- Do not put admin business logic in the SPA controllers; the panel is a separate surface.
- Do not bypass `canAccessPanel()` for admin gating; keep the access rule on the `User` model.
