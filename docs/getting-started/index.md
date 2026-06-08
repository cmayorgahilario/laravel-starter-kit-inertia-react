---
title: Getting started
description: Clone the repository, configure the environment and start the Laravel Starter Kit with Laravel Sail.
---

# Getting started

**Why it exists:** get the project running locally from scratch, with all Docker services up and the
database migrated.
**Covers:** requirements, dependency installation, environment variables, starting with Sail,
migrations and a health check.
**Does not cover:** the detail of each service (see [../services/index.md](../services/index.md)) or the
frontend development workflow (see [../frontend/index.md](../frontend/index.md)).

## Overview

The whole environment runs in Docker via **Laravel Sail**. The only requirement on the host is Docker
(and, for the git hooks, Node via nvm). You do not need PHP or Composer installed globally: the first
boot uses the Sail container.

## Steps

1. Clone the repository and enter the project folder.

2. Copy the environment file:

    ```bash
    cp .env.example .env
    ```

3. Install the PHP dependencies (using the Sail Composer container):

    ```bash
    docker run --rm -v "$(pwd)":/var/www/html -w /var/www/html laravelsail/php85-composer:latest composer install --ignore-platform-reqs
    ```

    From here on you can use `./vendor/bin/sail`.

4. Start the services (Postgres, Valkey, Meilisearch, RustFS, Mailpit, Soketi and the app):

    ```bash
    ./vendor/bin/sail up -d
    ```

5. Generate the application key and migrate the database:

    ```bash
    ./vendor/bin/sail artisan key:generate
    ./vendor/bin/sail artisan migrate
    ```

6. Create the initial administrative user (the "founder"). First fill in these variables in `.env`
   (they are empty in `.env.example`):

    ```dotenv
    AUTH_FOUNDER_NAME="Your Name"
    AUTH_FOUNDER_EMAIL=you@example.com
    AUTH_FOUNDER_PASSWORD=a-strong-password
    ```

    Then run the one-time operation that creates the founder and marks the email as verified:

    ```bash
    ./vendor/bin/sail artisan operations:process
    ```

    It throws an error if any of the three variables is blank. Detail in
    [../services/database.md](../services/database.md). For sample local data you can additionally run
    `./vendor/bin/sail artisan db:seed`.

7. Install dependencies and build the frontend assets:

    ```bash
    ./vendor/bin/sail pnpm install
    ./vendor/bin/sail pnpm dev
    ```

8. Install the git hooks **from the host** (not inside the container):

    ```bash
    lefthook install
    ```

    The reason and details are in [../tooling/git-hooks.md](../tooling/git-hooks.md).

## Health check

- The app responds at `http://localhost` (port `APP_PORT`, default 80).
- Laravel exposes a health endpoint at `/up` (configured in `bootstrap/app.php`).
- The admin panel is at `http://localhost/admin` (see [../admin-panel/index.md](../admin-panel/index.md)).
- Mailpit (development mailbox) is at `http://localhost:8025`.

## Troubleshooting

- If a Node/pnpm command fails with PATH errors, it is almost always because it ran outside Sail.
  Re-run it with the `./vendor/bin/sail` prefix.
- If the git hooks do not fire or point to `/var/www/html` paths, reinstall them from the host with
  `lefthook install` (see [../tooling/git-hooks.md](../tooling/git-hooks.md)).
