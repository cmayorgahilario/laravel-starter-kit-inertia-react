<?php

declare(strict_types=1);

use App\Models\Security\User;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

test('persists a user created through the factory', function (): void {
    $user = User::factory()->create();

    expect($user->exists)->toBeTrue();
    $this->assertDatabaseHas('security_users', ['email' => $user->email]);
});

test('hashes the password attribute', function (): void {
    $user = User::factory()->create();

    expect($user->password)->not->toBe('Password123!')
        ->and(Hash::check('Password123!', $user->password))->toBeTrue();
});

test('hides sensitive attributes when serialized', function (): void {
    $user = User::factory()->create();

    expect($user->toArray())
        ->not->toHaveKey('password')
        ->not->toHaveKey('remember_token');
});

test('appends the avatar_url attribute when serialized', function (): void {
    $user = User::factory()->create();

    expect($user->toArray())->toHaveKey('avatar_url');
});

test('can access the panel only when its email is verified', function (): void {
    $panel = Filament::getPanel('admin');

    expect(User::factory()->create()->canAccessPanel($panel))->toBeTrue()
        ->and(User::factory()->unverified()->create()->canAccessPanel($panel))->toBeFalse();
});

test('avatar_url uses the avatar disk when a photo exists', function (): void {
    Storage::fake('public');
    $user = User::factory()->withAvatar()->create();

    expect($user->avatar_url)->toBe(Storage::disk('public')->url((string) $user->avatar_path));
});

test('getFilamentAvatarUrl returns the stored avatar url', function (): void {
    Storage::fake('public');
    $user = User::factory()->withAvatar()->create();

    expect($user->getFilamentAvatarUrl())->toBe(Storage::disk('public')->url((string) $user->avatar_path));
});
