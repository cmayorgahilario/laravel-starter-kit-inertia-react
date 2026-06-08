<?php

declare(strict_types=1);

use App\Models\Security\User;

test('a user can authenticate with cookies', function (): void {
    $user = User::factory()->create();

    $this->postJson('/login', [
        'email' => $user->email,
        'password' => 'Password123!',
    ])->assertSuccessful();

    $this->assertAuthenticatedAs($user);
});

test('invalid credentials return 422', function (): void {
    $user = User::factory()->create();

    $this->postJson('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertStatus(422);

    $this->assertGuest();
});

test('a user can log out', function (): void {
    loginAsUser();

    $this->postJson('/logout')->assertSuccessful();

    $this->assertGuest();
});
