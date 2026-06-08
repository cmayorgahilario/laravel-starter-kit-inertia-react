<?php

declare(strict_types=1);

use App\Models\Security\User;

test('the login page is displayed', function (): void {
    visit('/login')
        ->assertSee('Welcome back')
        ->assertSee('Email');
});

test('a user can sign in from the form', function (): void {
    $user = User::factory()->create();

    visit('/login')
        ->fill('email', $user->email)
        ->fill('password', 'Password123!')
        ->press('Sign in')
        ->assertPathIs('/dashboard');
});

test('invalid credentials do not authenticate', function (): void {
    $user = User::factory()->create();

    visit('/login')
        ->fill('email', $user->email)
        ->fill('password', 'incorrecta')
        ->press('Sign in')
        ->assertPathIs('/login');
});
