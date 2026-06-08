---
title: UI, styling and hooks
description: shadcn/ui on Base UI, Tailwind 4 theming, the custom hooks and JSON requests with useHttp.
---

# UI, styling and hooks

## Overview

The component system is **shadcn/ui on top of Base UI** (`@base-ui/react`), styled with **Tailwind CSS
4**. Icons are Lucide (`lucide-react`), toasts are Sonner, and the theme supports light/dark/system.

## Components

`components.json` configures the shadcn setup:

| Setting       | Value                        |
| ------------- | ---------------------------- |
| Style         | `base-sera` (Base UI preset) |
| Base color    | `taupe`                      |
| CSS variables | enabled                      |
| Icon library  | `lucide-react`               |
| CSS output    | `resources/css/app.css`      |

Base UI primitives live in `resources/js/components/ui/` (button, input, label, field, card, dialog,
sheet, dropdown-menu, avatar, badge, input-otp, sonner, spinner, etc.). Project-specific components
(app header, user menu, theme toggle, UCP sidebar, passkeys/2FA management, delete account…) live
directly in `resources/js/components/`.

> [!NOTE]
> The `resources/js/components/ui/` files are generated/managed by shadcn and are listed among the
> ESLint ignores in `eslint.config.js`. Prefer regenerating or composing over hand-editing them.

## Styling and theme

The theme is defined in `resources/css/app.css` (Tailwind 4 with `@import 'tailwindcss'`), using
OKLCH color variables for `:root` (light) and `.dark` (dark). The font is Instrument Sans (loaded via
Bunny in `vite.config.ts`). The base radius is `--radius: 0.625rem`.

The theme value is persisted in the `appearance` cookie (read server-side by `HandleAppearance` to set
the `dark` class before render, avoiding a flash) and managed client-side by the `useAppearance` hook.
See [../architecture/app-bootstrap.md](../architecture/app-bootstrap.md).

## Custom hooks

Hooks live in `resources/js/hooks/`:

| Hook                    | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `use-appearance`        | Light/dark/system theme (localStorage + cookie + sync). |
| `use-clipboard`         | Copy text to clipboard.                                 |
| `use-current-url`       | Current page URL.                                       |
| `use-flash-toast`       | Turn flash messages into Sonner toasts.                 |
| `use-initials`          | Derive initials from a name.                            |
| `use-logout`            | Log out via Inertia.                                    |
| `use-mobile`            | Detect viewport < 768px.                                |
| `use-mobile-navigation` | Close the mobile menu on navigation.                    |
| `use-two-factor-auth`   | 2FA setup/verify/disable logic.                         |

## JSON requests

For JSON requests within the Inertia React app, use **`useHttp`** from `@inertiajs/react` (it handles
CSRF and 422 validation errors automatically), not manual `fetch`/`axios`. A real example is
`use-two-factor-auth.ts`, which calls `const { submit } = useHttp()`.

## Utilities

`resources/js/lib/utils.ts` exposes:

- `cn(...inputs)` — merge Tailwind classes (`clsx` + `tailwind-merge`).
- `toUrl(href)` — normalize an Inertia `href` to a URL string.
