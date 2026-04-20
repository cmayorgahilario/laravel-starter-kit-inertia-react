---
title: Theming
description: Tailwind v4 oklch token system, how tokens map to CSS variables, and how to customize or swap the shadcn preset.
---

# Theming

## Overview

This project uses Tailwind CSS v4's CSS-first configuration model. There is no `tailwind.config.js` — everything lives in a single file:

```
resources/css/app.css
```

The theme is built on three cooperating mechanisms:

- **`@theme`** — maps Tailwind design tokens to CSS custom properties, making utilities like `bg-primary` and `text-foreground` available.
- **`:root`** — declares the actual _values_ for the light-mode tokens.
- **`.dark`** — overrides those values for dark mode.

shadcn/ui components consume these tokens by reading the CSS variables at runtime, so changing a variable value immediately affects every component that uses it.

## How the Theme Is Wired

```css
/* 1. Custom dark-mode variant — .dark class on any ancestor activates it */
@custom-variant dark (&:is(.dark *));

/* 2. @theme — binds Tailwind utilities to CSS variable names */
@theme {
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    /* ... one mapping per semantic token */
}

/* 3. :root — light-mode values */
:root {
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    /* ... */
}

/* 4. .dark — dark-mode overrides */
.dark {
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    /* ... */
}
```

The `@custom-variant dark (&:is(.dark *))` line means the `.dark` class can be placed on any ancestor element (typically `<html>`) and all descendants switch to dark-mode values. `next-themes` manages the toggle at runtime.

## oklch Primer

All color tokens use the `oklch()` function:

```
oklch(L C H)
```

| Component | Range | Meaning |
| --- | --- | --- |
| `L` | `0` – `1` | Lightness: `0` = black, `1` = white |
| `C` | `0` – ~`0.4` | Chroma (saturation): `0` = achromatic grey |
| `H` | `0` – `360` | Hue angle in degrees |

oklch is **perceptually uniform** — equal numeric changes produce equal perceived changes, making it far more predictable than HSL. It covers the full **P3 wide-gamut** color space on supporting displays. The neutral palette in this project has `C = 0` (achromatic), so all neutrals are pure greys at varying lightness levels.

## Color Palette

### Light Mode (`:root`)

| Token | CSS Variable | oklch Value | Tailwind Utility Example |
| --- | --- | --- | --- |
| Background | `--background` | `oklch(1 0 0)` | `bg-background` |
| Foreground | `--foreground` | `oklch(0.145 0 0)` | `text-foreground` |
| Card | `--card` | `oklch(1 0 0)` | `bg-card` |
| Card Foreground | `--card-foreground` | `oklch(0.145 0 0)` | `text-card-foreground` |
| Popover | `--popover` | `oklch(1 0 0)` | `bg-popover` |
| Popover Foreground | `--popover-foreground` | `oklch(0.145 0 0)` | `text-popover-foreground` |
| Primary | `--primary` | `oklch(0.205 0 0)` | `bg-primary` |
| Primary Foreground | `--primary-foreground` | `oklch(0.985 0 0)` | `text-primary-foreground` |
| Secondary | `--secondary` | `oklch(0.97 0 0)` | `bg-secondary` |
| Secondary Foreground | `--secondary-foreground` | `oklch(0.205 0 0)` | `text-secondary-foreground` |
| Muted | `--muted` | `oklch(0.97 0 0)` | `bg-muted` |
| Muted Foreground | `--muted-foreground` | `oklch(0.556 0 0)` | `text-muted-foreground` |
| Accent | `--accent` | `oklch(0.97 0 0)` | `bg-accent` |
| Accent Foreground | `--accent-foreground` | `oklch(0.205 0 0)` | `text-accent-foreground` |
| Destructive | `--destructive` | `oklch(0.577 0.245 27.325)` | `bg-destructive` |
| Destructive Foreground | `--destructive-foreground` | `oklch(1 0 0)` | `text-destructive-foreground` |
| Border | `--border` | `oklch(0.922 0 0)` | `border-border` |
| Input | `--input` | `oklch(0.922 0 0)` | `border-input` |
| Ring | `--ring` | `oklch(0.708 0 0)` | `ring-ring` |
| Chart 1 | `--chart-1` | `oklch(0.81 0.1 252)` | `fill-chart-1` |
| Chart 2 | `--chart-2` | `oklch(0.62 0.19 260)` | `fill-chart-2` |
| Chart 3 | `--chart-3` | `oklch(0.55 0.22 263)` | `fill-chart-3` |
| Chart 4 | `--chart-4` | `oklch(0.49 0.22 264)` | `fill-chart-4` |
| Chart 5 | `--chart-5` | `oklch(0.42 0.18 266)` | `fill-chart-5` |
| Sidebar | `--sidebar` | `oklch(0.985 0 0)` | `bg-sidebar` |
| Sidebar Foreground | `--sidebar-foreground` | `oklch(0.145 0 0)` | `text-sidebar-foreground` |
| Sidebar Primary | `--sidebar-primary` | `oklch(0.205 0 0)` | `bg-sidebar-primary` |
| Sidebar Primary Foreground | `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `text-sidebar-primary-foreground` |
| Sidebar Accent | `--sidebar-accent` | `oklch(0.97 0 0)` | `bg-sidebar-accent` |
| Sidebar Accent Foreground | `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `text-sidebar-accent-foreground` |
| Sidebar Border | `--sidebar-border` | `oklch(0.922 0 0)` | `border-sidebar-border` |
| Sidebar Ring | `--sidebar-ring` | `oklch(0.708 0 0)` | `ring-sidebar-ring` |

### Dark Mode (`.dark`)

| Token | CSS Variable | oklch Value |
| --- | --- | --- |
| Background | `--background` | `oklch(0.145 0 0)` |
| Foreground | `--foreground` | `oklch(0.985 0 0)` |
| Card | `--card` | `oklch(0.205 0 0)` |
| Card Foreground | `--card-foreground` | `oklch(0.985 0 0)` |
| Popover | `--popover` | `oklch(0.269 0 0)` |
| Popover Foreground | `--popover-foreground` | `oklch(0.985 0 0)` |
| Primary | `--primary` | `oklch(0.922 0 0)` |
| Primary Foreground | `--primary-foreground` | `oklch(0.205 0 0)` |
| Secondary | `--secondary` | `oklch(0.269 0 0)` |
| Secondary Foreground | `--secondary-foreground` | `oklch(0.985 0 0)` |
| Muted | `--muted` | `oklch(0.269 0 0)` |
| Muted Foreground | `--muted-foreground` | `oklch(0.708 0 0)` |
| Accent | `--accent` | `oklch(0.371 0 0)` |
| Accent Foreground | `--accent-foreground` | `oklch(0.985 0 0)` |
| Destructive | `--destructive` | `oklch(0.704 0.191 22.216)` |
| Destructive Foreground | `--destructive-foreground` | `oklch(0.985 0 0)` |
| Border | `--border` | `oklch(0.275 0 0)` |
| Input | `--input` | `oklch(0.325 0 0)` |
| Ring | `--ring` | `oklch(0.556 0 0)` |
| Chart 1 | `--chart-1` | `oklch(0.81 0.1 252)` |
| Chart 2 | `--chart-2` | `oklch(0.62 0.19 260)` |
| Chart 3 | `--chart-3` | `oklch(0.55 0.22 263)` |
| Chart 4 | `--chart-4` | `oklch(0.49 0.22 264)` |
| Chart 5 | `--chart-5` | `oklch(0.42 0.18 266)` |
| Sidebar | `--sidebar` | `oklch(0.205 0 0)` |
| Sidebar Foreground | `--sidebar-foreground` | `oklch(0.985 0 0)` |
| Sidebar Primary | `--sidebar-primary` | `oklch(0.488 0.243 264.376)` |
| Sidebar Primary Foreground | `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| Sidebar Accent | `--sidebar-accent` | `oklch(0.269 0 0)` |
| Sidebar Accent Foreground | `--sidebar-accent-foreground` | `oklch(0.985 0 0)` |
| Sidebar Border | `--sidebar-border` | `oklch(0.275 0 0)` |
| Sidebar Ring | `--sidebar-ring` | `oklch(0.439 0 0)` |

Note: The sidebar primary color in dark mode (`oklch(0.488 0.243 264.376)`) introduces a blue-purple accent — the only chromatic token in the dark palette.

## Typography

The default font stack is set in `@theme`:

```css
@theme {
    --font-sans:
        'Instrument Sans', ui-sans-serif, system-ui, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';
}
```

Apply it with the `font-sans` utility class. The `@fontsource-variable/geist` package is installed as an alternative variable font. To switch, replace `'Instrument Sans'` with `'Geist'` in the `--font-sans` declaration and import the font in `app.css`:

```css
@import '@fontsource-variable/geist';
```

## Spacing

The base spacing unit is set in `:root`:

```css
:root {
    --spacing: 0.25rem; /* 4px */
}
```

Tailwind v4 derives all spacing utilities — `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` — from this single value. `p-4` equals `4 × 0.25rem = 1rem`. Changing `--spacing` rescales every utility simultaneously.

## Radii

Border radius tokens are defined in `@theme` using the base `--radius` variable:

| `@theme` Token | Expression | Computed Value | Utility |
| --- | --- | --- | --- |
| `--radius-lg` | `var(--radius)` | `0.625rem` | `rounded-lg` |
| `--radius-md` | `calc(var(--radius) - 2px)` | `0.375rem` | `rounded-md` |
| `--radius-sm` | `calc(var(--radius) - 4px)` | `0.125rem` | `rounded-sm` |

The base `--radius: 0.625rem` is declared in `:root` (and repeated in `.dark` to keep both contexts self-contained). To make the UI squarer, reduce `--radius`; to make it rounder, increase it.

## Shadows

All shadow tokens are set in `:root` (identical values in `.dark`). The decomposed primitive values control the shadow appearance:

| Variable | Value |
| --- | --- |
| `--shadow-x` | `0` |
| `--shadow-y` | `1px` |
| `--shadow-blur` | `3px` |
| `--shadow-spread` | `0px` |
| `--shadow-opacity` | `0.1` |
| `--shadow-color` | `oklch(0 0 0)` |

Composed shadow tokens:

| Token | Value | Utility |
| --- | --- | --- |
| `--shadow-2xs` | `0 1px 3px 0px hsl(0 0% 0% / 0.05)` | `shadow-2xs` |
| `--shadow-xs` | `0 1px 3px 0px hsl(0 0% 0% / 0.05)` | `shadow-xs` |
| `--shadow-sm` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)` | `shadow-sm` |
| `--shadow` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)` | `shadow` |
| `--shadow-md` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1)` | `shadow-md` |
| `--shadow-lg` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1)` | `shadow-lg` |
| `--shadow-xl` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1)` | `shadow-xl` |
| `--shadow-2xl` | `0 1px 3px 0px hsl(0 0% 0% / 0.25)` | `shadow-2xl` |

## Dark Mode

Dark mode activates when the `.dark` class is present on any ancestor of the element. Typically it is set on `<html>`. The `next-themes` package (installed) handles the toggle mechanics — it persists the user's preference in `localStorage` and applies/removes the `.dark` class.

The `@custom-variant dark (&:is(.dark *))` line in `app.css` teaches Tailwind about this convention so `dark:` prefixed utilities work correctly:

```tsx
<div className="bg-background dark:text-muted-foreground" />
```

To add a token that differs between modes:

```css
:root {
    --my-surface: oklch(0.96 0 0); /* light value */
}

.dark {
    --my-surface: oklch(0.22 0 0); /* dark override */
}
```

Then expose it in `@theme` (see next section).

## Adding / Customizing Tokens

Follow this three-step recipe to introduce a new semantic token:

**Step 1** — Declare the raw value in `:root` (and its dark override in `.dark`):

```css
:root {
    --brand-surface: oklch(0.95 0.03 250);
}

.dark {
    --brand-surface: oklch(0.20 0.03 250);
}
```

**Step 2** — Expose it in `@theme` so Tailwind generates utilities:

```css
@theme {
    --color-brand-surface: var(--brand-surface);
}
```

**Step 3** — Use the generated utility in your components:

```tsx
<div className="bg-brand-surface text-foreground" />
```

Tailwind v4 reads `@theme` at build time and creates `bg-brand-surface`, `text-brand-surface`, `border-brand-surface`, and `fill-brand-surface` utilities automatically.

## Changing the shadcn Preset or Base Color

`components.json` controls how shadcn generates component code and what token palette it seeds:

| Field | Current Value | Meaning |
| --- | --- | --- |
| `style` | `base-nova` | Nova preset — modern rounded aesthetic |
| `tailwind.baseColor` | `neutral` | Neutral (grey) palette seeded into `:root`/`.dark` |
| `tailwind.css` | `resources/css/app.css` | CSS entry point where tokens are written |
| `tailwind.cssVariables` | `true` | Components reference CSS variables, not inline colors |

To switch to a different base color (e.g., `slate`, `zinc`, `stone`, `gray`) or a different style preset:

> **Warning:** Re-initializing rewrites the `:root` and `.dark` blocks in `resources/css/app.css`, discarding any custom tokens you've added. Back up `app.css` before proceeding.

```bash
# Back up the current token palette
cp resources/css/app.css resources/css/app.css.bak

# Re-run shadcn init — follow the prompts to pick style and base color
vendor/bin/sail bunx --bun shadcn@latest init
```

After init, restore any custom tokens from `app.css.bak` and merge them into the new `:root`/`.dark` blocks manually.

For component-level configuration and adding individual components, see [shadcn/ui](./shadcn.md).

## Verification

After modifying any token:

```bash
# One-time build — checks that CSS compiles without errors
vendor/bin/sail bun run build

# Dev server with HMR — token changes reflect immediately in the browser
vendor/bin/sail bun run dev
```

To confirm a token is live in the browser, open DevTools → Elements, select `<html>`, and inspect the computed `--<token-name>` value under **Styles**.

## References

- [Tailwind CSS v4 — Theme Variables](https://tailwindcss.com/docs/theme)
- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming)
- [oklch.com](https://oklch.com) — interactive oklch color picker
- [MDN — oklch()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
