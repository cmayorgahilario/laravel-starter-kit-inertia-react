<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Storage;

test('a user can delete their account', function (): void {
    $user = loginAsUser();

    $response = $this->delete('/ucp/account', ['password' => 'Password123!']);
    $response->assertSessionHasNoErrors();
    $response->assertRedirect('/');

    $this->assertDatabaseMissing('security_users', ['id' => $user->id]);
    $this->assertGuest();
});

test('deleting an account removes the avatar file', function (): void {
    Storage::fake('public');
    $user = loginAsUser();
    Storage::disk('public')->put('avatars/to-delete.png', 'x');
    $user->forceFill(['avatar_path' => 'avatars/to-delete.png'])->save();

    $this->delete('/ucp/account', ['password' => 'Password123!'])->assertRedirect('/');

    Storage::disk('public')->assertMissing('avatars/to-delete.png');
    $this->assertDatabaseMissing('security_users', ['id' => $user->id]);
});

test('deleting an account requires the correct password', function (): void {
    $user = loginAsUser();

    $this->from('/ucp/profile')
        ->delete('/ucp/account', ['password' => 'wrong-password'])
        ->assertRedirect('/ucp/profile');

    $this->assertDatabaseHas('security_users', ['id' => $user->id]);
});
