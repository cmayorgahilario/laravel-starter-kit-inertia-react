<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rules\Password;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Fortify;
use PragmaRX\Google2FA\Google2FA;

beforeEach(function () {
    Password::defaults(fn () => Password::min(8)->mixedCase()->letters()->numbers());
});

/**
 * Creates a user with fully confirmed 2FA (secret + confirmed_at set).
 * Requires an active session (actingAs), so call $this->actingAs($user) first,
 * then call this to wire up 2FA state in both the session and the database.
 *
 * @return array{user: User, codes: list<string>}
 */
function setupConfirmedTwoFactor(): array
{
    $user = User::factory()->create();

    // Confirm password so the password.confirm middleware passes
    test()->actingAs($user)
        ->post('/user/confirm-password', ['password' => 'password']);

    // Enable 2FA — populates two_factor_secret and two_factor_recovery_codes
    test()->post('/user/two-factor-authentication');

    $user->refresh();

    // Generate a valid TOTP from the decrypted secret
    $secret = Fortify::currentEncrypter()->decrypt($user->two_factor_secret);
    $google2fa = app(Google2FA::class);
    $validCode = $google2fa->getCurrentOtp($secret);

    // Confirm 2FA — sets two_factor_confirmed_at
    test()->post('/user/confirmed-two-factor-authentication', ['code' => $validCode]);

    $user->refresh();

    $codes = json_decode(
        Fortify::currentEncrypter()->decrypt($user->two_factor_recovery_codes),
        true
    );

    // Clear the TOTP replay-protection cache so the same time-window code can
    // be verified again within a single test (clock doesn't advance in tests).
    Cache::flush();

    return ['user' => $user, 'codes' => $codes];
}

// ---------------------------------------------------------------------------
// Enable flow
// ---------------------------------------------------------------------------

test('user can enable two-factor authentication', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/user/confirm-password', ['password' => 'password']);

    $this->post('/user/two-factor-authentication')
        ->assertRedirect();

    $user->refresh();

    expect($user->two_factor_secret)->not->toBeNull();
});

test('user can fetch QR code after enabling', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/user/confirm-password', ['password' => 'password']);

    $this->post('/user/two-factor-authentication');

    $this->get('/user/two-factor-qr-code')
        ->assertOk()
        ->assertJsonStructure(['svg', 'url']);
});

test('user can confirm two-factor authentication with valid code', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/user/confirm-password', ['password' => 'password']);

    $this->post('/user/two-factor-authentication');

    $user->refresh();

    $secret = Fortify::currentEncrypter()->decrypt($user->two_factor_secret);
    $google2fa = app(Google2FA::class);
    $validCode = $google2fa->getCurrentOtp($secret);

    $this->post('/user/confirmed-two-factor-authentication', ['code' => $validCode])
        ->assertRedirect();

    $user->refresh();

    expect($user->two_factor_confirmed_at)->not->toBeNull();
});

test('user cannot confirm two-factor with invalid code', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/user/confirm-password', ['password' => 'password']);

    $this->post('/user/two-factor-authentication');

    $this->post('/user/confirmed-two-factor-authentication', ['code' => '000000'])
        ->assertSessionHasErrors(['code'], null, 'confirmTwoFactorAuthentication');
});

// ---------------------------------------------------------------------------
// Login challenge
// ---------------------------------------------------------------------------

test('user with 2FA is redirected to challenge after login', function () {
    ['user' => $user] = setupConfirmedTwoFactor();

    $this->post('/logout');

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect('/two-factor-challenge');
});

test('user can authenticate with valid TOTP code', function () {
    ['user' => $user] = setupConfirmedTwoFactor();

    $this->post('/logout');

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $user->refresh();
    $secret = Fortify::currentEncrypter()->decrypt($user->two_factor_secret);
    $google2fa = app(Google2FA::class);
    $validCode = $google2fa->getCurrentOtp($secret);

    $this->post('/two-factor-challenge', ['code' => $validCode])
        ->assertRedirect('/dashboard');

    $this->assertAuthenticated();
});

test('user cannot authenticate with invalid TOTP code', function () {
    ['user' => $user] = setupConfirmedTwoFactor();

    $this->post('/logout');

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->post('/two-factor-challenge', ['code' => '000000'])
        ->assertSessionHasErrors('code');

    $this->assertGuest();
});

test('user can authenticate with valid recovery code', function () {
    ['user' => $user, 'codes' => $codes] = setupConfirmedTwoFactor();

    $this->post('/logout');

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->post('/two-factor-challenge', ['recovery_code' => $codes[0]])
        ->assertRedirect('/dashboard');

    $this->assertAuthenticated();
});

test('user cannot authenticate with invalid recovery code', function () {
    ['user' => $user] = setupConfirmedTwoFactor();

    $this->post('/logout');

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->post('/two-factor-challenge', ['recovery_code' => 'invalid-recovery-code'])
        ->assertSessionHasErrors('recovery_code');

    $this->assertGuest();
});

// ---------------------------------------------------------------------------
// Disable flow
// ---------------------------------------------------------------------------

test('user can disable two-factor authentication', function () {
    ['user' => $user] = setupConfirmedTwoFactor();

    // Re-confirm password (session may have been reset by logout inside setupConfirmedTwoFactor)
    $this->actingAs($user)
        ->post('/user/confirm-password', ['password' => 'password']);

    $this->delete('/user/two-factor-authentication')
        ->assertRedirect();

    $user->refresh();

    expect($user->two_factor_secret)->toBeNull()
        ->and($user->two_factor_confirmed_at)->toBeNull();
});

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------

test('unauthenticated user cannot access 2FA management endpoints', function () {
    $this->post('/user/two-factor-authentication')
        ->assertRedirect('/login');

    $this->delete('/user/two-factor-authentication')
        ->assertRedirect('/login');
});

// ---------------------------------------------------------------------------
// Shared Inertia prop
// ---------------------------------------------------------------------------

test('two_factor_confirmed_at is shared in Inertia props', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->has('auth.user.two_factor_confirmed_at')
        );
});
