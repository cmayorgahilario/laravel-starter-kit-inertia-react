<?php

declare(strict_types=1);

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Request;

test('shares default props', function (): void {
    $shared = (new HandleInertiaRequests)->share(Request::create('/'));

    expect($shared)->toBeArray();
});

test('resolves an asset version without error', function (): void {
    $version = (new HandleInertiaRequests)->version(Request::create('/'));

    expect($version === null || is_string($version))->toBeTrue();
});
