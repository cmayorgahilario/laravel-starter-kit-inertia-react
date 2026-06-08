<?php

declare(strict_types=1);

test('the profile page shows the user information', function (): void {
    loginAsUser();

    visit('/ucp/profile')
        ->assertSee('Profile information')
        ->assertSee('Danger zone');
});

test('a user can update their name', function (): void {
    $user = loginAsUser();

    visit('/ucp/profile')
        ->fill('name', 'Updated Name')
        ->press('Save changes')
        ->assertSee('Profile updated');

    expect($user->fresh()->name)->toBe('Updated Name');
});
