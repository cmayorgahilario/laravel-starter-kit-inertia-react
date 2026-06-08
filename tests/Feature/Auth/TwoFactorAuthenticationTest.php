<?php

declare(strict_types=1);

use Laravel\Fortify\Fortify;
use PragmaRX\Google2FA\Google2FA;

test('a user can enable 2FA', function (): void {
    $user = loginAsUser();
    $this->withSession(['auth.password_confirmed_at' => now()->timestamp]);

    $this->postJson('/user/two-factor-authentication')->assertSuccessful();

    expect($user->fresh()->two_factor_secret)->not->toBeNull();
});

test('a user can confirm 2FA with a valid code', function (): void {
    $user = loginAsUser();
    $this->withSession(['auth.password_confirmed_at' => now()->timestamp]);
    $this->postJson('/user/two-factor-authentication')->assertSuccessful();

    $secret = Fortify::currentEncrypter()->decrypt($user->fresh()->two_factor_secret);
    $code = resolve(Google2FA::class)->getCurrentOtp($secret);

    $this->postJson('/user/confirmed-two-factor-authentication', ['code' => $code])->assertSuccessful();

    expect($user->fresh()->two_factor_confirmed_at)->not->toBeNull();
});

test('a user can disable 2FA', function (): void {
    $user = loginAsUser();
    $this->withSession(['auth.password_confirmed_at' => now()->timestamp]);
    $this->postJson('/user/two-factor-authentication')->assertSuccessful();

    $this->deleteJson('/user/two-factor-authentication')->assertSuccessful();

    expect($user->fresh()->two_factor_secret)->toBeNull();
});
