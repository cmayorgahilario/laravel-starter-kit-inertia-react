<?php

declare(strict_types=1);

use App\Models\Security\User;
use Inertia\Testing\AssertableInertia as Assert;

test('login page renders', function () {
    $this->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('auth/login'));
});

test('user can authenticate with valid credentials', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect('/dashboard');

    $this->assertAuthenticated();
});

test('user cannot authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('user can logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/logout')
        ->assertRedirect('/');

    $this->assertGuest();
});

test('authenticated user accessing login is redirected to dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/login')
        ->assertRedirect('/dashboard');
});

test('guest accessing dashboard is redirected to login', function () {
    $this->get('/dashboard')
        ->assertRedirect('/login');
});

test('remember me checkbox creates long-lived session cookie', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ]);

    $response->assertCookie(Auth::guard()->getRecallerName());
});
