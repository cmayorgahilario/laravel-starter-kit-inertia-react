<?php

declare(strict_types=1);

use App\Filament\Resources\Security\Users\Pages\CreateUser;
use App\Filament\Resources\Security\Users\Pages\ListUsers;
use App\Filament\Resources\Security\Users\Pages\ViewUser;

use function Pest\Livewire\livewire;

test('the user form exposes the avatar field', function (): void {
    loginAsUser();

    livewire(CreateUser::class)->assertFormFieldExists('avatar_path');
});

test('the users table exposes the avatar column', function (): void {
    loginAsUser();

    livewire(ListUsers::class)->assertTableColumnExists('avatar_path');
});

test('creating a user without an avatar still works', function (): void {
    loginAsUser();

    livewire(CreateUser::class)
        ->fillForm([
            'name' => 'Grace Hopper',
            'email' => 'grace@example.com',
            'password' => 'password1234',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $this->assertDatabaseHas('security_users', ['email' => 'grace@example.com']);
});

test('the user view renders with the avatar entry', function (): void {
    $user = loginAsUser();

    livewire(ViewUser::class, ['record' => $user->getRouteKey()])->assertSuccessful();
});
