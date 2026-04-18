<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rules\Password;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Password::defaults(fn () => Password::min(8)->mixedCase()->letters()->numbers());
});

test('profile page renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/profile')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/profile')
            ->has('mustVerifyEmail')
            ->has('status'));
});

test('profile page requires authentication', function () {
    $this->get('/settings/profile')
        ->assertRedirect('/login');
});

test('user can update name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Updated Name',
            'email' => $user->email,
        ])
        ->assertRedirect(route('settings.profile.edit'));

    $this->assertDatabaseHas('security_users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

test('email change clears email verification', function () {
    $user = User::factory()->create();

    Notification::fake();

    $this->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => 'newemail@example.com',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('security_users', [
        'id' => $user->id,
        'email' => 'newemail@example.com',
        'email_verified_at' => null,
    ]);
});

test('profile update fails with missing name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/settings/profile', [
            'name' => '',
            'email' => $user->email,
        ])
        ->assertSessionHasErrors('name');
});

test('profile update fails with invalid email', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => 'not-an-email',
        ])
        ->assertSessionHasErrors('email');
});

test('profile update fails with duplicate email', function () {
    $user = User::factory()->create();
    User::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => 'taken@example.com',
        ])
        ->assertSessionHasErrors('email');
});

test('user can delete account with correct password', function () {
    // ProfileDeleteRequest applies Password::defaults() to the provided password —
    // the factory default 'password' doesn't satisfy mixedCase+numbers, so we use
    // a compliant password that also matches the stored hash.
    $user = User::factory()->create(['password' => Hash::make('Password1!')]);

    $this->actingAs($user)
        ->delete('/settings/profile', ['password' => 'Password1!'])
        ->assertRedirect('/');

    $this->assertDatabaseMissing('security_users', ['id' => $user->id]);
});

test('account deletion fails with wrong password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete('/settings/profile', ['password' => 'wrong-password'])
        ->assertSessionHasErrors('password');

    $this->assertDatabaseHas('security_users', ['id' => $user->id]);
});
