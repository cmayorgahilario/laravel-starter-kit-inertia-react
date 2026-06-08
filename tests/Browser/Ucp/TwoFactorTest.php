<?php

declare(strict_types=1);

use App\Models\Security\User;
use Laravel\Fortify\Fortify;
use PragmaRX\Google2FA\Google2FA;

test('the security page shows the enable 2FA button when disabled', function (): void {
    loginAsUser();

    confirmPasswordInBrowser();

    visit('/ucp/security')->assertSee('Enable two-factor authentication');
});

test('a user can enable and confirm 2FA through the setup modal', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    confirmPasswordInBrowser();

    $page = visit('/ucp/security');
    $page->click('Enable two-factor authentication')
        ->assertSee('QR code')
        ->click('Continue');

    $secret = Fortify::currentEncrypter()->decrypt($user->fresh()->two_factor_secret);
    $code = resolve(Google2FA::class)->getCurrentOtp($secret);

    $page->type('otp', $code)
        ->press('Confirm')
        ->assertSee('Active');
});

test('a user can disable 2FA', function (): void {
    $user = User::factory()->create()->forceFill([
        'two_factor_secret' => encrypt(resolve(Google2FA::class)->generateSecretKey()),
        'two_factor_confirmed_at' => now(),
    ]);
    $user->save();

    $this->actingAs($user);

    confirmPasswordInBrowser();

    visit('/ucp/security')
        ->assertSee('Active')
        ->click('Disable two-factor authentication')
        ->assertSee('Enable two-factor authentication');
});
