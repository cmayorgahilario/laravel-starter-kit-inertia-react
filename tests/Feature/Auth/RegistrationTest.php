<?php

declare(strict_types=1);

use App\Models\Security\User;

test('a user can register', function (): void {
    $this->postJson('/register', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'password1234',
        'password_confirmation' => 'password1234',
    ])->assertSuccessful();

    $this->assertDatabaseHas('security_users', ['email' => 'ada@example.com']);
    $this->assertAuthenticated();
});

test('a registered user starts unverified', function (): void {
    $this->postJson('/register', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'password1234',
        'password_confirmation' => 'password1234',
    ])->assertSuccessful();

    $user = User::query()->firstWhere('email', 'ada@example.com');

    expect($user)->not->toBeNull()
        ->and($user->hasVerifiedEmail())->toBeFalse();
});
