---
title: File storage
description: Local disk by default, S3/RustFS as an option and the dedicated avatars disk.
---

# File storage

## Overview

The default disk is **`local`** (`FILESYSTEM_DISK=local`), rooted at `storage/app/private`
(`config/filesystems.php`). The `public` disk (`storage/app/public`) and an `s3` disk (AWS S3 config)
are also defined. In production the `s3` disk can point to **RustFS**, the S3-compatible service
provisioned by `compose.yaml` (ports 9000/9001).

| Disk     | Root / target         | Use                                                     |
| -------- | --------------------- | ------------------------------------------------------- |
| `local`  | `storage/app/private` | Default, private.                                       |
| `public` | `storage/app/public`  | Publicly accessible files.                              |
| `s3`     | S3 bucket / RustFS    | Production (`AWS_*` variables empty in `.env.example`). |

## Avatars (decoupled disk)

User avatars use a disk **separate from the default disk**, configured in `config/avatars.php`:

| Option    | Variable           | Default   | Notes                                  |
| --------- | ------------------ | --------- | -------------------------------------- |
| Disk      | `AVATAR_DISK`      | `public`  | In production `s3`/RustFS is expected. |
| Directory | `AVATAR_DIRECTORY` | `avatars` | Folder within the disk.                |

The upload/delete logic lives in the `App\Models\Security\Concerns\HasProfilePhoto` trait. When a user
has no avatar, a fallback URL with their initials is generated (external `ui-avatars.com` service).
Managing the photo from the frontend goes through
`App\Http\Controllers\Security\ProfilePhotoController`.

> [!NOTE]
> The avatar disk is intentionally independent from the general `FILESYSTEM_DISK` so avatars can stay
> on a public-readable disk even if the rest of the app uses private storage. The rationale is
> documented in `config/avatars.php`.
