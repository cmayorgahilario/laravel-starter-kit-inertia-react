<?php

declare(strict_types=1);

test('the dashboard redirects to login when unauthenticated', function (): void {
    visit('/dashboard')->assertPathIs('/login');
});

test('an authenticated user sees the dashboard', function (): void {
    loginAsUser();

    visit('/dashboard')->assertSee('Dashboard');
});
