<?php

use App\Models\User;
use Carbon\CarbonImmutable;

test('user password is cast to hashed', function () {
    $user = User::factory()->create(['password' => 'plain-text-password']);

    expect($user->password)->not->toBe('plain-text-password');
});

test('user email_verified_at is cast to datetime', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    expect($user->email_verified_at)->toBeInstanceOf(CarbonImmutable::class);
});
