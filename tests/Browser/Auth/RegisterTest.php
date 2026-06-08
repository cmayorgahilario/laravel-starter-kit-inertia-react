<?php

declare(strict_types=1);

test('the registration page is displayed', function (): void {
    visit('/register')
        ->assertSee('Create your account')
        ->assertSee('Full name');
});

test('a user can register and is asked to verify their email', function (): void {
    visit('/register')
        ->fill('name', 'Ada Lovelace')
        ->fill('email', 'ada@example.com')
        ->fill('password', 'password1234')
        ->fill('password_confirmation', 'password1234')
        ->press('Create account')
        ->assertSee('Verify your email');

    $this->assertDatabaseHas('security_users', ['email' => 'ada@example.com']);
});
