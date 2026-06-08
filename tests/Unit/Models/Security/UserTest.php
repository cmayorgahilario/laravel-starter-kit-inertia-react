<?php

declare(strict_types=1);

use App\Models\Security\User;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

test('is an authenticatable model', function (): void {
    expect(is_subclass_of(User::class, Authenticatable::class))->toBeTrue();
});

test('can access Filament panels', function (): void {
    expect(class_implements(User::class))->toContain(FilamentUser::class);
});

test('maps to the security_users table', function (): void {
    $attributes = new ReflectionClass(User::class)->getAttributes(Table::class);

    expect($attributes)->toHaveCount(1)
        ->and($attributes[0]->getArguments()[0])->toBe('security_users');
});

test('uses the auth traits for tokens and two-factor', function (): void {
    $traits = class_uses_recursive(User::class);

    expect($traits)->toContain(HasApiTokens::class)
        ->and($traits)->toContain(TwoFactorAuthenticatable::class);
});

test('avatar_url falls back to generated initials when no photo is set', function (): void {
    $user = new User(['name' => 'Ada Lovelace']);

    expect($user->avatar_url)->toContain('ui-avatars.com')
        ->and($user->avatar_url)->toContain('AL');
});

test('getFilamentAvatarUrl is null without a photo', function (): void {
    expect(new User(['name' => 'Ada'])->getFilamentAvatarUrl())->toBeNull();
});
