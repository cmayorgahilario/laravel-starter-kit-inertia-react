<?php

declare(strict_types=1);

use App\Models\Security\User;

test('the forgot password page is displayed', function (): void {
    visit('/forgot-password')
        ->assertSee('Recover your access')
        ->assertSee('Email');
});

test('a user can request a password reset link', function (): void {
    $user = User::factory()->create();

    visit('/forgot-password')
        ->fill('email', $user->email)
        ->press('Send reset link');

    $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);
});
