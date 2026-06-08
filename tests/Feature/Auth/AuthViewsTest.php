<?php

declare(strict_types=1);

use App\Models\Security\User;
use PragmaRX\Google2FA\Google2FA;

test('the auth view routes render', function (): void {
    $this->get('/login')->assertOk();
    $this->get('/register')->assertOk();
    $this->get('/forgot-password')->assertOk();
    $this->get('/reset-password/fake-token')->assertOk();
});

test('the email verification notice renders for unverified users', function (): void {
    $this->actingAs(User::factory()->unverified()->create());

    $this->get('/email/verify')->assertOk();
});

test('the confirm password view renders', function (): void {
    loginAsUser();

    $this->get('/user/confirm-password')->assertOk();
});

test('the two-factor challenge view renders during login', function (): void {
    $secret = resolve(Google2FA::class)->generateSecretKey();

    $user = User::factory()->create()->forceFill([
        'two_factor_secret' => encrypt($secret),
        'two_factor_confirmed_at' => now(),
    ]);
    $user->save();

    $this->post('/login', ['email' => $user->email, 'password' => 'Password123!']);

    $this->get('/two-factor-challenge')->assertOk();
});
