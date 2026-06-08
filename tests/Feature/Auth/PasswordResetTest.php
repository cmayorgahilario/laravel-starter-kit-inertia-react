<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

test('forgot-password sends the reset link', function (): void {
    Notification::fake();
    $user = User::factory()->create();

    $this->postJson('/forgot-password', ['email' => $user->email])->assertSuccessful();

    Notification::assertSentTo($user, ResetPassword::class);
});

test('reset-password changes the password with a valid token', function (): void {
    $user = User::factory()->create();
    $token = Password::broker()->createToken($user);

    $this->postJson('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password-1234',
        'password_confirmation' => 'new-password-1234',
    ])->assertSuccessful();

    expect(Hash::check('new-password-1234', $user->fresh()->password))->toBeTrue();
});
