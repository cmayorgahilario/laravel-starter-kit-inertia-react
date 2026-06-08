<?php

declare(strict_types=1);

test('the password page is displayed', function (): void {
    loginAsUser();

    visit('/ucp/password')
        ->assertSee('Password')
        ->assertSee('Current password');
});
