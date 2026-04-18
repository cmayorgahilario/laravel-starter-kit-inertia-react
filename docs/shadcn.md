---
title: shadcn/ui
description: Component library setup, installed components, usage patterns, and configuration reference for shadcn/ui in the React Starter Kit.
---

# shadcn/ui

## Overview

This project uses [shadcn/ui](https://ui.shadcn.com) as its component library. shadcn/ui is not a traditional npm package — it copies component source files directly into your repository, giving you full ownership of the code. All 55 components ship pre-installed at `resources/js/components/ui/`.

| Setting | Value |
|---|---|
| Style preset | `base-nova` |
| Icon library | Lucide (`lucide-react`) |
| TypeScript | Yes (`tsx: true`) |
| CSS variables | Yes |
| Tailwind base color | `neutral` |
| CSS entry | `resources/css/app.css` |

## Installed Components

All 55 components are located in `resources/js/components/ui/`:

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `badge` · `breadcrumb` · `button` · `button-group` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `collapsible` · `combobox` · `command` · `context-menu` · `dialog` · `direction` · `drawer` · `dropdown-menu` · `empty` · `field` · `hover-card` · `input` · `input-group` · `input-otp` · `item` · `kbd` · `label` · `menubar` · `native-select` · `navigation-menu` · `pagination` · `popover` · `progress` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `toggle` · `toggle-group` · `tooltip`

## Using Components

Import from the `@/components/ui/*` alias, which maps to `resources/js/components/ui/`:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                </div>
                <Button type="submit" className="w-full">Sign in</Button>
            </CardContent>
        </Card>
    )
}
```

The `@/` alias resolves to `resources/js/` and is configured in both `tsconfig.json` and `vite.config.ts`.

## `cn()` Utility

The `cn()` helper at `resources/js/lib/utils.ts` merges Tailwind class names using `clsx` and `tailwind-merge`:

```ts
import { cn } from '@/lib/utils'

// Merge conditional classes safely
<div className={cn('base-class', isActive && 'active-class', className)} />
```

Use `cn()` anywhere you need to combine or conditionally apply Tailwind classes — it handles conflicts correctly (e.g., `p-4` vs `p-2` last-wins).

## Adding or Updating Components

To add a new component from the shadcn registry:

```bash
vendor/bin/sail bunx --bun shadcn@latest add <component-name>
```

For example:

```bash
vendor/bin/sail bunx --bun shadcn@latest add date-picker
```

The component file is written to `resources/js/components/ui/<component-name>.tsx`. Since you own the file, you can edit it freely — no library upgrade will overwrite your changes.

To update an existing component to its latest registry version, run the same `add` command. You will be prompted to confirm the overwrite.

## Configuration Reference

`components.json` at the project root controls shadcn's code generation:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "resources/css/app.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

| Field | Value | Meaning |
|---|---|---|
| `style` | `base-nova` | Nova preset — modern rounded aesthetic with neutral base |
| `rsc` | `false` | No React Server Components (Inertia SPA model) |
| `tsx` | `true` | Components use `.tsx` extension |
| `tailwind.css` | `resources/css/app.css` | Tailwind v4 CSS-first entry point |
| `tailwind.cssVariables` | `true` | Colors and radius use CSS custom properties |
| `iconLibrary` | `lucide` | `lucide-react` for all icon usage |
| `aliases.ui` | `@/components/ui` | Short import path for components |
| `aliases.utils` | `@/lib/utils` | Location of `cn()` helper |

## Official Documentation

Full component API reference, examples, and theming guides: **[ui.shadcn.com](https://ui.shadcn.com)**
