---
title: Mail
description: Sending over SMTP to Mailpit in development; inbox on port 8025.
---

# Mail

## Overview

In development, mail is sent over **SMTP to Mailpit**, the mail-catching service in `compose.yaml`.
Nothing leaves the machine: every message (email verification, password reset, etc.) lands in the
Mailpit inbox.

| Variable            | Default (`.env.example`) |
| ------------------- | ------------------------ |
| `MAIL_MAILER`       | `smtp`                   |
| `MAIL_HOST`         | `mailpit`                |
| `MAIL_PORT`         | `1025`                   |
| `MAIL_FROM_ADDRESS` | `hello@example.com`      |

> [!NOTE]
> The default in `config/mail.php` is the `log` mailer, but `.env.example` overrides it to `smtp`
> pointing at Mailpit, which is the real development behavior.

## Inbox

- SMTP: port `1025`.
- Web UI: `http://localhost:8025`.

Transactional emails are triggered by Fortify features (email verification, password reset). See
[../authentication/index.md](../authentication/index.md).

## In tests

`phpunit.xml` sets `MAIL_MAILER=array`, so tests send no real mail and can assert on the queued
messages.
