<?php

declare(strict_types=1);

test('the mobile menu opens and lets you navigate', function (): void {
    loginAsUser();

    visit('/ucp/profile')
        ->resize(390, 844)
        ->click('button[aria-label="Open navigation menu"]')
        ->assertSee('Dashboard')
        ->click('[data-slot="sheet-content"] nav a')
        ->assertPathIs('/dashboard');
});

test('the mobile menu footer exposes the account actions and theme', function (): void {
    $user = loginAsUser();

    visit('/ucp/profile')
        ->resize(390, 844)
        ->click('button[aria-label="Open navigation menu"]')
        ->assertSee($user->name)
        ->assertSee('My profile')
        ->assertSee('Sign out')
        ->assertSee('Light')
        ->assertSee('Dark')
        ->assertSee('System');
});

test('the mobile menu closes when resizing to desktop', function (): void {
    loginAsUser();

    visit('/dashboard')
        ->resize(390, 844)
        ->click('button[aria-label="Open navigation menu"]')
        ->assertSee('Sign out')
        ->resize(1280, 800)
        ->assertDontSee('Sign out');
});
