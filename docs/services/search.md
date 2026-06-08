---
title: Search
description: Meilisearch is provisioned in compose.yaml, but Laravel Scout is not installed yet.
---

# Search

## Overview

`compose.yaml` provisions a **Meilisearch** container (`getmeili/meilisearch:latest`, port 7700) ready
to be used as a search engine. However, the application-level integration does not exist yet.

> [!WARNING]
> There is no active search in the application. Reviewed:
>
> - `composer.json` does not include `laravel/scout` nor the Meilisearch driver.
> - There is no `config/scout.php`.
> - No model uses the `Searchable` trait.
>
> The Meilisearch service is available in the development environment, but wiring it up would require
> installing Scout, publishing its config and marking models as searchable. Document this page when
> that happens.
