<?php

declare(strict_types=1);

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a user can upload their profile photo', function (): void {
    Storage::fake('public');
    $user = loginAsUser();

    $this->post('/user/profile-information', [
        '_method' => 'PUT',
        'name' => $user->name,
        'email' => $user->email,
        'photo' => UploadedFile::fake()->image('avatar.png', 200, 200),
    ], ['Accept' => 'application/json'])->assertOk();

    $user->refresh();

    expect($user->avatar_path)->not->toBeNull();
    Storage::disk('public')->assertExists((string) $user->avatar_path);
});

test('uploading a new photo deletes the previous one', function (): void {
    Storage::fake('public');
    $user = loginAsUser();
    Storage::disk('public')->put('avatars/old.png', 'old');
    $user->forceFill(['avatar_path' => 'avatars/old.png'])->save();

    $this->post('/user/profile-information', [
        '_method' => 'PUT',
        'name' => $user->name,
        'email' => $user->email,
        'photo' => UploadedFile::fake()->image('new.png'),
    ], ['Accept' => 'application/json'])->assertOk();

    Storage::disk('public')->assertMissing('avatars/old.png');
});

test('it rejects files that are not images', function (): void {
    Storage::fake('public');
    $user = loginAsUser();

    $this->post('/user/profile-information', [
        '_method' => 'PUT',
        'name' => $user->name,
        'email' => $user->email,
        'photo' => UploadedFile::fake()->create('virus.pdf', 100, 'application/pdf'),
    ], ['Accept' => 'application/json'])->assertStatus(422)->assertJsonValidationErrors(['photo']);
});
