<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Validation\Rules\Password;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    // Remove uncompromised() to avoid external HIBP HTTP calls in tests
    Password::defaults(fn () => Password::min(8)->mixedCase()->letters()->numbers());
});

test('registration page renders', function () {
    $this->get('/register')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('auth/register'));
});

test('user can register with valid data', function () {
    Event::fake([Registered::class]);

    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertRedirect();

    $this->assertDatabaseHas('security_users', [
        'email' => 'test@example.com',
        'name' => 'Test User',
    ]);

    Event::assertDispatched(Registered::class);
});

test('registered user has null email_verified_at', function () {
    $this->post('/register', [
        'name' => 'Unverified User',
        'email' => 'unverified@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $user = User::where('email', 'unverified@example.com')->first();

    expect($user->email_verified_at)->toBeNull();
});

test('registration fails with invalid email', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'not-an-email',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('email');

    $this->assertDatabaseMissing('security_users', ['name' => 'Test User']);
});

test('registration fails with missing name', function () {
    $this->post('/register', [
        'name' => '',
        'email' => 'test@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('name');
});

test('registration fails with weak password', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'pass',
        'password_confirmation' => 'pass',
    ])->assertSessionHasErrors('password');
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $this->post('/register', [
        'name' => 'Another User',
        'email' => 'existing@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('email');
});

test('registration fails when passwords do not match', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'DifferentPassword1!',
    ])->assertSessionHasErrors('password');
});
