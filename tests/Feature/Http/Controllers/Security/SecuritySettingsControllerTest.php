<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;

test('the security page redirects to confirm the password when it is not confirmed', function (): void {
    loginAsUser();

    $this->get('/ucp/security')->assertRedirect('/user/confirm-password');
});

test('the security page renders once the password is confirmed', function (): void {
    loginAsUser();
    $this->withSession(['auth.password_confirmed_at' => now()->timestamp]);

    $this->get('/ucp/security')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('ucp/security')
            ->has('passkeys')
            ->has('requiresConfirmation')
        );
});
