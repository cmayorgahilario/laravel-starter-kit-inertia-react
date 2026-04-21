---
title: Mail
description: Local mail development with Mailpit, the Laravel smtp mailer, and the Fortify mailables pipeline.
---

# Mail

The stack ships a fully-wired local mail loop: every email sent by the app is captured by **Mailpit** and viewable in its web dashboard — no real SMTP credentials required during development.

## Infrastructure

Mailpit runs as a Docker Compose service alongside the application:

```yaml
# compose.yaml
mailpit:
    image: 'axllent/mailpit:latest'
    ports:
        - '${FORWARD_MAILPIT_PORT:-1025}:1025'
        - '${FORWARD_MAILPIT_DASHBOARD_PORT:-8025}:8025'
    networks:
        - sail
```

| Port | Purpose |
|------|---------|
| **1025** | SMTP — Laravel delivers mail here |
| **8025** | Mailpit web UI — browse captured messages |

Port forwarding uses `FORWARD_MAILPIT_PORT` / `FORWARD_MAILPIT_DASHBOARD_PORT` env vars, both defaulting to the standard values. When Sail is running, open `http://localhost:8025` to inspect all outgoing mail.

## Laravel Wiring

`.env.example` pre-configures the smtp mailer to point at the Mailpit container:

```ini
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

`config/mail.php` resolves these at runtime:

```php
// Default mailer — overridden to "smtp" by .env
'default' => env('MAIL_MAILER', 'log'),

// smtp driver config
'smtp' => [
    'transport' => 'smtp',
    'scheme'    => env('MAIL_SCHEME'),
    'host'      => env('MAIL_HOST', '127.0.0.1'),
    'port'      => env('MAIL_PORT', 2525),
    'username'  => env('MAIL_USERNAME'),
    'password'  => env('MAIL_PASSWORD'),
    'timeout'   => null,
],

// Global from address
'from' => [
    'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
    'name'    => env('MAIL_FROM_NAME', env('APP_NAME', 'Laravel')),
],
```

The fallback default in `config/mail.php` is `log` (writes to `storage/logs/laravel.log`), but `.env.example` overrides this to `smtp` so all mail goes through Mailpit in development.

Other transports declared in `config/mail.php` — `ses`, `postmark`, `resend`, `sendmail`, `log`, `array`, `failover`, `roundrobin` — are available for production use but not configured here.

## Development Loop

```
App code                smtp transport         Mailpit
──────────  →  Mail::send() / Notification::send()  →  mailpit:1025  →  http://localhost:8025
```

No external mail provider is needed. Sail brings up Mailpit automatically; Laravel delivers via the smtp transport; messages appear in the Mailpit dashboard within milliseconds.

## Fortify Mailables Pipeline

Fortify's authentication flows that send mail — **password reset** and **email verification** — both route through this pipeline automatically.

The `User` model (`app/Models/Security/User.php`) carries two contracts and one trait that enable this:

| Symbol | Role |
|--------|------|
| `implements MustVerifyEmail` | Activates Fortify's email-verification flow |
| `use Notifiable` | Grants `notify()` / `notifyNow()` dispatch on the model |

When Fortify sends a password-reset link or an email-verification prompt, it dispatches a notification via the `Notifiable` trait. Laravel resolves the default `smtp` mailer from `config/mail.php`, delivers to `mailpit:1025`, and the message appears in the Mailpit dashboard at `localhost:8025`.

No additional configuration is needed for these flows in a Sail environment.

## What Is Not Yet Implemented

There is no `app/Mail/` directory in this repository: no custom `Mailable` classes have been created and no app-defined notification types beyond Fortify's built-ins exist. Adding application-specific email (order confirmations, weekly digests, etc.) would follow the standard Laravel pattern of `php artisan make:mail` / `php artisan make:notification`, then delivering via `Mail::to()->send()` or `Notification::send()` — both will land in Mailpit automatically during development.
