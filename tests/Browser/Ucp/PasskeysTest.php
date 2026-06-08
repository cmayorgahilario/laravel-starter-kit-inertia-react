<?php

declare(strict_types=1);

use App\Models\Security\User;

test('the passkeys section shows the empty state when there are none', function (): void {
    loginAsUser();

    confirmPasswordInBrowser();

    visit('/ucp/security')
        ->assertSee('Passkeys')
        ->assertSee('No passkeys');
});

test('the list shows the registered passkeys', function (): void {
    $user = User::factory()->create();
    $user->passkeys()->create([
        'name' => 'MacBook de trabajo',
        'credential_id' => 'cred-listado',
        'credential' => ['type' => 'public-key'],
    ]);

    $this->actingAs($user);

    confirmPasswordInBrowser();

    visit('/ucp/security')->assertSee('MacBook de trabajo');
});

test('the add passkey button reveals the registration form', function (): void {
    loginAsUser();

    confirmPasswordInBrowser();

    visit('/ucp/security')
        ->click('Add passkey')
        ->assertSee('Passkey name')
        ->assertSee('Register passkey');
});

test('a user can delete a passkey', function (): void {
    $user = User::factory()->create();
    $user->passkeys()->create([
        'name' => 'Dispositivo a eliminar',
        'credential_id' => 'cred-eliminar',
        'credential' => ['type' => 'public-key'],
    ]);

    $this->actingAs($user);

    confirmPasswordInBrowser();

    visit('/ucp/security')
        ->assertSee('Dispositivo a eliminar')
        ->click('button[aria-label="Remove passkey"]')
        ->assertDontSee('Dispositivo a eliminar');

    expect($user->fresh()->passkeys)->toHaveCount(0);
});
