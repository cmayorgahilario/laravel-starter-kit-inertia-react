<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Hash;

test('a user can change their password', function (): void {
    $user = loginAsUser();

    $this->putJson('/user/password', [
        'current_password' => 'Password123!',
        'password' => 'new-password-1234',
        'password_confirmation' => 'new-password-1234',
    ])->assertSuccessful();

    expect(Hash::check('new-password-1234', $user->fresh()->password))->toBeTrue();
});

test('it rejects the change when the current password does not match', function (): void {
    $user = loginAsUser();

    $this->putJson('/user/password', [
        'current_password' => 'wrong',
        'password' => 'new-password-1234',
        'password_confirmation' => 'new-password-1234',
    ])->assertStatus(422);

    expect(Hash::check('Password123!', $user->fresh()->password))->toBeTrue();
});
