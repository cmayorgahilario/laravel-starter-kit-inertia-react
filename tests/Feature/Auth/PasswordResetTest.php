<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    // Remove uncompromised() to avoid external HIBP HTTP calls in tests
    PasswordRule::defaults(fn () => PasswordRule::min(8)->mixedCase()->letters()->numbers());
});

test('forgot password page renders', function () {
    $this->get('/forgot-password')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('auth/forgot-password'));
});

test('reset link can be requested for existing email', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email])
        ->assertSessionHas('status');

    Notification::assertSentTo($user, ResetPassword::class);
});

test('reset link request for unknown email shows no error', function () {
    $this->post('/forgot-password', ['email' => 'nonexistent@example.com'])
        ->assertSessionHasErrors('email');
});

test('reset password page renders with valid token', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
        $token = $notification->token;

        $this->get('/reset-password/'.$token.'?email='.urlencode($user->email))
            ->assertSuccessful()
            ->assertInertia(fn (Assert $page) => $page->component('auth/reset-password'));

        return true;
    });
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
        $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'NewPassword1!',
            'password_confirmation' => 'NewPassword1!',
        ])->assertRedirect('/login');

        return true;
    });
});

test('password reset fails with invalid token', function () {
    $user = User::factory()->create();

    $this->post('/reset-password', [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertSessionHasErrors('email');
});
