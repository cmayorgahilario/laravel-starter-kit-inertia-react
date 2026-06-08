---
title: Broadcasting / WebSockets
description: Soketi is provisioned in compose.yaml, but the default broadcast is the log driver.
---

# Broadcasting / WebSockets

## Overview

`compose.yaml` provisions **Soketi** (`quay.io/soketi/soketi:latest-16-alpine`, ports 6001/9601), a
WebSocket server compatible with the Pusher protocol. The app does not emit real-time events yet.

| Variable               | Default (`.env.example`) |
| ---------------------- | ------------------------ |
| `BROADCAST_CONNECTION` | `log`                    |

> [!WARNING]
> Broadcasting is not active. Reviewed:
>
> - `BROADCAST_CONNECTION=log` in `.env.example`: events are written to the log, not emitted.
> - There is no `config/broadcasting.php` published in the repository.
> - The `PUSHER_*` variables exist in `.env.example` for Soketi compatibility, but the default
>   connection does not use them.
>
> The Soketi service is available in development. To enable real-time you would publish the broadcasting
> config, switch `BROADCAST_CONNECTION` to `pusher` (pointing at Soketi) and define the channels.
> Document this page when that happens.
