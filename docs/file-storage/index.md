---
title: File Storage
description: S3-compatible object storage via rustfs, fully wired end-to-end.
---

# File Storage

File storage is fully wired end-to-end. The default `Storage::*` facade routes to a locally-running S3-compatible service called **rustfs**, backed by the `league/flysystem-aws-s3-v3` driver. No additional setup is required for local development — the service starts with `sail up` and the `.env` values are pre-configured.

## Infrastructure

rustfs runs as a Docker service defined in `compose.yaml`:

```yaml
# compose.yaml (excerpt)
rustfs:
  image: 'rustfs/rustfs:latest'
  ports:
    - '${FORWARD_RUSTFS_PORT:-9000}:9000'        # S3 API
    - '${FORWARD_RUSTFS_CONSOLE_PORT:-9001}:9001' # Web console UI
  environment:
    RUSTFS_VOLUMES: /data
    RUSTFS_ADDRESS: '0.0.0.0:9000'
    RUSTFS_CONSOLE_ADDRESS: '0.0.0.0:9001'
    RUSTFS_CONSOLE_ENABLE: 'true'
    RUSTFS_EXTERNAL_ADDRESS: ':9000'
    RUSTFS_CORS_ALLOWED_ORIGINS: '*'
    RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS: '*'
    RUSTFS_ACCESS_KEY: sail
    RUSTFS_SECRET_KEY: password
    RUSTFS_LOG_LEVEL: info
  volumes:
    - 'sail-rustfs:/data'
  networks:
    - sail
  healthcheck:
    test:
      - CMD
      - sh
      - '-c'
      - 'curl -f http://127.0.0.1:9000/health && curl -f http://127.0.0.1:9001/health'
    interval: 30s
```

| Port | Purpose |
|------|---------|
| 9000 | S3-compatible API endpoint |
| 9001 | Web console (browser dashboard) |

Data is persisted in the named Docker volume `sail-rustfs`.

## Laravel Wiring

### Environment Variables

`.env.example` ships with all required keys pre-configured:

```dotenv
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=sail
AWS_SECRET_ACCESS_KEY=password
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=local
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_ENDPOINT=http://rustfs:9000
```

`AWS_USE_PATH_STYLE_ENDPOINT=true` is required for S3-compatible services that don't use subdomain-style bucket URLs. `AWS_ENDPOINT` points inside the Docker network — containers reach rustfs at `rustfs:9000`, and the host reaches it at `localhost:9000`.

### `config/filesystems.php`

The `s3` disk definition reads directly from the `AWS_*` environment variables:

```php
// config/filesystems.php
'default' => env('FILESYSTEM_DISK', 'local'),

'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
        'serve' => true,
        'throw' => false,
        'report' => false,
    ],

    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL', 'http://localhost').'/storage',
        'visibility' => 'public',
        'throw' => false,
        'report' => false,
    ],

    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'endpoint' => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        'throw' => false,
        'report' => false,
    ],
],

'links' => [
    public_path('storage') => storage_path('app/public'),
],
```

### Composer Dependency

The S3 driver requires `league/flysystem-aws-s3-v3`, which is declared as a production dependency:

```json
// composer.json
"league/flysystem-aws-s3-v3": "^3.0"
```

## Default Disk Routing

With `FILESYSTEM_DISK=s3` set, all calls to `Storage::put()`, `Storage::get()`, `Storage::delete()`, etc. route to rustfs by default. The `local` and `public` disks remain available by passing the disk name explicitly:

```php
Storage::disk('local')->put('file.txt', $contents);
Storage::disk('public')->put('image.jpg', $data);
Storage::put('upload.pdf', $data); // → rustfs (s3 disk)
```

The `storage:link` Artisan command creates the symlink `public/storage → storage/app/public`, making files on the `public` disk web-accessible at `/storage/*`. This link path is defined in the `links` array in `config/filesystems.php`.

## Local Access

The rustfs web console is available at **http://localhost:9001** when `sail up` is running.

- Default bucket: `local` (matches `AWS_BUCKET=local`)
- Access key: `sail`
- Secret key: `password`

The console provides a file browser, bucket management, and basic object operations — useful for verifying uploads during local development without needing the AWS CLI.

## What Is Not Wired

The infrastructure and framework configuration are complete, but no application-layer file handling exists yet:

- No upload controllers or form handlers
- No Eloquent models with file associations
- No signed URL generation in app code
- No media library or attachment packages

Adding any of these is straightforward given that the `Storage` facade is fully operational.
