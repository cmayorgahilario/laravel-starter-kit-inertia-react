<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Validation\Rules\Password;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    // Strip uncompromised() to avoid external HIBP HTTP calls in tests
    Password::defaults(fn () => Password::min(8)->mixedCase()->letters()->numbers());
});

test('password page renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get('/settings/password')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/password')
            ->has('status'));
});

test('password page requires authentication', function () {
    $this->get('/settings/password')
        ->assertRedirect('/login');
});

test('user can update password with correct current password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put('/settings/password', [
            'current_password' => 'password',
            'password' => 'NewPassword1!',
            'password_confirmation' => 'NewPassword1!',
        ])
        ->assertRedirect(route('settings.password.edit'));

    $this->assertDatabaseHas('security_users', ['id' => $user->id]);
});

test('password update fails with wrong current password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put('/settings/password', [
            'current_password' => 'wrong-password',
            'password' => 'NewPassword1!',
            'password_confirmation' => 'NewPassword1!',
        ])
        ->assertSessionHasErrorsIn('updatePassword', 'current_password');
});

test('password update fails when new password is missing', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put('/settings/password', [
            'current_password' => 'password',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertSessionHasErrorsIn('updatePassword', 'password');
});

test('password update fails when confirmation does not match', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put('/settings/password', [
            'current_password' => 'password',
            'password' => 'NewPassword1!',
            'password_confirmation' => 'DifferentPassword1!',
        ])
        ->assertSessionHasErrorsIn('updatePassword', 'password');
});
