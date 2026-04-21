---
title: Realtime / WebSockets
description: Soketi infrastructure and the log-default broadcaster gap
---

# Realtime / WebSockets

The project provisions a [Soketi](https://docs.soketi.app/) WebSocket server and exposes all required Pusher-compatible credentials, but the Laravel application broadcaster is set to `log` by default. No broadcasting config, event classes, or client packages have been wired up yet.

## Infrastructure in Place

### Soketi Service

`compose.yaml` includes a dedicated Soketi container:

```yaml
soketi:
    image: 'quay.io/soketi/soketi:latest-16-alpine'
    environment:
        SOKETI_DEBUG: '${SOKETI_DEBUG:-1}'
        SOKETI_METRICS_SERVER_PORT: '9601'
        SOKETI_DEFAULT_APP_ID: '${PUSHER_APP_ID}'
        SOKETI_DEFAULT_APP_KEY: '${PUSHER_APP_KEY}'
        SOKETI_DEFAULT_APP_SECRET: '${PUSHER_APP_SECRET}'
    ports:
        - '${PUSHER_PORT:-6001}:6001'
        - '${PUSHER_METRICS_PORT:-9601}:9601'
    networks:
        - sail
```

| Port | Protocol | Purpose |
| ---- | -------- | ------- |
| 6001 | WebSocket | Client connections (WS/WSS) |
| 9601 | HTTP | Prometheus-compatible metrics endpoint |

### Environment Variables

`.env.example` ships with a full set of Pusher-compatible credentials and their Vite mirrors:

```dotenv
BROADCAST_CONNECTION=log

PUSHER_APP_ID=app-id
PUSHER_APP_KEY=app-key
PUSHER_APP_SECRET=app-secret
PUSHER_HOST=localhost
PUSHER_PORT=6001
PUSHER_SCHEME=http
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

The `VITE_PUSHER_*` mirrors are injected into the frontend bundle so client-side code can read them without a server round-trip.

## Application-Side Gap

The Soketi container runs and the credentials are in place, but the Laravel application has not been connected to it:

| Item | Status | Evidence |
| ---- | ------ | -------- |
| `BROADCAST_CONNECTION` | `log` (events written to log, not pushed) | `.env.example` line 1 in section above |
| `config/broadcasting.php` | **Does not exist** | `ls config/broadcasting.php` → absent |
| `routes/channels.php` | **Does not exist** | `ls routes/channels.php` → absent |
| `pusher/pusher-php-server` | **Not installed** | absent from `composer.json` require/require-dev |
| `pusher-js` | **Not installed** | absent from `package.json` dependencies |
| `laravel-echo` | **Not installed** | absent from `package.json` dependencies |
| Any class implementing `ShouldBroadcast` | **None** | `grep -r ShouldBroadcast app/` → no matches |

With `BROADCAST_CONNECTION=log`, every `event(new MyEvent())` call simply writes a log entry — nothing is pushed to Soketi or any WebSocket client.

::: warning Not Yet Implemented
The Laravel broadcasting layer is pre-provisioned (Soketi container + Pusher credentials) but not wired up. To activate realtime broadcasting you would need to:

1. Change `BROADCAST_CONNECTION` to `pusher` in `.env`.
2. Install server-side package: `composer require pusher/pusher-php-server`.
3. Publish `config/broadcasting.php`: `artisan vendor:publish --tag=laravel-broadcasting`.
4. Create `routes/channels.php` for channel authorization.
5. Install client packages: `bun add laravel-echo pusher-js`.
6. Create event classes that implement `ShouldBroadcast`.

This work is tracked under R116 in `REQUIREMENTS.md`.
:::

## References

- Soketi image: `quay.io/soketi/soketi:latest-16-alpine` — see `compose.yaml`
- Env keys: `.env.example` (`PUSHER_*`, `VITE_PUSHER_*`, `BROADCAST_CONNECTION`)
- Laravel Broadcasting docs: <https://laravel.com/docs/broadcasting>
