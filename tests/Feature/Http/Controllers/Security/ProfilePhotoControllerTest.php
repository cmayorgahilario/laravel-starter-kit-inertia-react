<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Storage;

test('a user can delete their profile photo', function (): void {
    Storage::fake('public');
    Storage::disk('public')->put('avatars/me.png', 'data');
    $user = loginAsUser();
    $user->forceFill(['avatar_path' => 'avatars/me.png'])->save();

    $this->deleteJson('/user/profile-photo')
        ->assertOk()
        ->assertJsonStructure(['avatar_url']);

    $user->refresh();

    expect($user->avatar_path)->toBeNull();
    Storage::disk('public')->assertMissing('avatars/me.png');
});

test('deleting the photo requires authentication', function (): void {
    $this->deleteJson('/user/profile-photo')->assertUnauthorized();
});
