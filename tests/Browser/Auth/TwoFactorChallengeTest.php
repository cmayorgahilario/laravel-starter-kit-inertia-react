<?php

declare(strict_types=1);

use App\Models\Security\User;
use PragmaRX\Google2FA\Google2FA;

test('a user with 2FA must pass the challenge when signing in', function (): void {
    $secret = resolve(Google2FA::class)->generateSecretKey();

    $user = User::factory()->create()->forceFill([
        'two_factor_secret' => encrypt($secret),
        'two_factor_confirmed_at' => now(),
    ]);
    $user->save();

    $page = visit('/login');
    $page->fill('email', $user->email)
        ->fill('password', 'Password123!')
        ->press('Sign in')
        ->assertSee('Two-factor authentication');

    $code = resolve(Google2FA::class)->getCurrentOtp($secret);

    $page->type('code', $code)
        ->press('Verify')
        ->assertPathIs('/dashboard');
});

test('an invalid two-factor code does not authenticate', function (): void {
    $secret = resolve(Google2FA::class)->generateSecretKey();

    $user = User::factory()->create()->forceFill([
        'two_factor_secret' => encrypt($secret),
        'two_factor_confirmed_at' => now(),
    ]);
    $user->save();

    visit('/login')
        ->fill('email', $user->email)
        ->fill('password', 'Password123!')
        ->press('Sign in')
        ->assertSee('Two-factor authentication')
        ->type('code', '000000')
        ->press('Verify')
        ->assertPathBeginsWith('/two-factor-challenge');
});
