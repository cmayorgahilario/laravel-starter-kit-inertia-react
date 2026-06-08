<?php

declare(strict_types=1);

test('the security page redirects to confirm the password when not confirmed', function (): void {
    loginAsUser();

    visit('/ucp/security')->assertSee('Confirm your password');
});

test('confirming the password returns to the security page, not the dashboard', function (): void {
    loginAsUser();

    visit('/ucp/security')
        ->assertSee('Confirm your password')
        ->fill('password', 'Password123!')
        ->press('Confirm')
        ->assertSee('Two-factor authentication')
        ->assertSee('Passkeys');
});

test('the security page shows 2FA and passkeys once the password is confirmed', function (): void {
    loginAsUser();

    confirmPasswordInBrowser();

    visit('/ucp/security')
        ->assertSee('Two-factor authentication')
        ->assertSee('Passkeys');
});
