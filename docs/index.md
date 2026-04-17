---
title: React Starter Kit
description: A Laravel 13 + React starter kit with a full local service stack — PostgreSQL, Redis, Typesense, RustFS, Mailpit, and Soketi — all orchestrated via Docker Compose and Laravel Sail.
layout: home

hero:
  name: React Starter Kit
  tagline: Laravel 13 · PHP 8.5 · Vite 8 · Tailwind CSS v4 — with a production-grade local service stack out of the box.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Architecture
      link: /architecture
---

## Stack

| Layer | Package / Image | Version |
|---|---|---|
| PHP | `sail-8.5/app` (runtime) | 8.5 |
| PHP constraint | `composer.json` require | ^8.3 |
| Framework | `laravel/framework` | ^13.0 |
| Frontend bundler | Vite | ^8.0.0 |
| CSS | Tailwind CSS | ^4.0.0 |
| Database | `postgres:18-alpine` | PostgreSQL 18 |
| Cache | Database (SQL) | — |
| Sessions | Redis | `redis:alpine` |
| Queues | Redis | `redis:alpine` |
| Full-text search | `typesense/typesense:27.1` | 27.1 |
| Object storage | `rustfs/rustfs:latest` (S3-compatible) | latest |
| Local mail | `axllent/mailpit:latest` | latest |
| WebSockets | `quay.io/soketi/soketi:latest-16-alpine` | latest-16-alpine |

## Quick Links

- [Getting Started](/getting-started) — clone, configure, and boot the stack
- [Architecture](/architecture) — service topology, ports, and environment drivers
