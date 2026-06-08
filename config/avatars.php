<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Avatar Disk
    |--------------------------------------------------------------------------
    |
    | The filesystem disk where user avatars are stored. It is intentionally
    | decoupled from the default application disk so avatars can stay on a
    | public-readable disk ("public" in local dev, "s3"/rustfs in production)
    | regardless of what FILESYSTEM_DISK is used for elsewhere.
    |
    */

    'disk' => env('AVATAR_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Avatar Directory
    |--------------------------------------------------------------------------
    |
    | The directory within the disk where uploaded avatar files are kept.
    |
    */

    'directory' => env('AVATAR_DIRECTORY', 'avatars'),

];
