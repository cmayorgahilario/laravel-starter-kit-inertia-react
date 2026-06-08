<?php

declare(strict_types=1);

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

test('fortify renders the auth views via Inertia', function (): void {
    expect(config('fortify.views'))->toBeTrue();
});

test('the 7 features are enabled', function (): void {
    expect(Features::enabled(Features::registration()))->toBeTrue()
        ->and(Features::enabled(Features::resetPasswords()))->toBeTrue()
        ->and(Features::enabled(Features::emailVerification()))->toBeTrue()
        ->and(Features::enabled(Features::updateProfileInformation()))->toBeTrue()
        ->and(Features::enabled(Features::updatePasswords()))->toBeTrue()
        ->and(Features::enabled(Features::twoFactorAuthentication()))->toBeTrue()
        ->and(Features::canManagePasskeys())->toBeTrue();
});

test('the registration endpoint responds with JSON validation errors', function (): void {
    $this->postJson('/register', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('the two-factor rate limiter is keyed by the login id', function (): void {
    $request = Request::create('/two-factor-challenge', 'POST');
    $request->setLaravelSession(resolve(Session::class));
    $request->session()->put('login.id', 7);

    $limit = RateLimiter::limiter('two-factor')($request);

    expect($limit)->toBeInstanceOf(Limit::class)
        ->and($limit->maxAttempts)->toBe(5);
});
