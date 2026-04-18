<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

test('verify email page renders for unverified user', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get('/email/verify')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('auth/verify-email'));
});

test('verified user can access dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertSuccessful();
});

test('unverified user is redirected to verify-email when accessing protected routes', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertRedirect('/email/verify');
});

test('email can be verified via signed URL', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertRedirectContains('/dashboard');

    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

test('verification notification can be resent', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertRedirect();

    Notification::assertSentTo($user, VerifyEmail::class);
});

test('invalid verification link does not verify email', function () {
    $user = User::factory()->unverified()->create();

    $invalidUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => 'invalid-hash']
    );

    $this->actingAs($user)
        ->get($invalidUrl)
        ->assertForbidden();

    expect($user->fresh()->email_verified_at)->toBeNull();
});
