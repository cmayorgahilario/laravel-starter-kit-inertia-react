<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Notification;

test('a user can update their name and email', function (): void {
    Notification::fake();
    $user = loginAsUser();

    $this->putJson('/user/profile-information', [
        'name' => 'Updated Name',
        'email' => $user->email,
    ])->assertSuccessful();

    expect($user->fresh()->name)->toBe('Updated Name');
});

test('updating the email re-verifies the account', function (): void {
    Notification::fake();
    $user = loginAsUser();

    $this->putJson('/user/profile-information', [
        'name' => $user->name,
        'email' => 'new-email@example.com',
    ])->assertSuccessful();

    expect($user->fresh()->email)->toBe('new-email@example.com')
        ->and($user->fresh()->email_verified_at)->toBeNull();
});
