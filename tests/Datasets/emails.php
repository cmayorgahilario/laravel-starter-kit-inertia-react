<?php

declare(strict_types=1);

// Auto-discovered by Pest; use with ->with('invalid emails').
dataset('invalid emails', [
    'empty' => '',
    'missing at-sign' => 'laravel.com',
    'missing domain' => 'hello@',
    'with spaces' => 'hello world@laravel.com',
]);
