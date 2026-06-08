<?php

declare(strict_types=1);

use App\Filament\Resources\Security\Users\Pages\CreateUser;
use App\Models\Security\User;
use Illuminate\Support\Facades\Hash;

use function Pest\Livewire\livewire;

test('renders the create page', function (): void {
    loginAsUser();

    livewire(CreateUser::class)->assertOk();
});

test('creates a user with a hashed password', function (): void {
    loginAsUser();

    livewire(CreateUser::class)
        ->fillForm([
            'name' => 'Ada Lovelace',
            'email' => 'ada@laravel.com',
            'password' => 'secret-password',
        ])
        ->call('create')
        ->assertHasNoFormErrors()
        ->assertNotified();

    $user = User::query()->where('email', 'ada@laravel.com')->first();

    expect($user)->not->toBeNull()
        ->and(Hash::check('secret-password', $user->password))->toBeTrue();
});

test('requires name, email and password', function (): void {
    loginAsUser();

    livewire(CreateUser::class)
        ->fillForm(['name' => null, 'email' => null, 'password' => null])
        ->call('create')
        ->assertHasFormErrors([
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);
});

test('validates the email format', function (): void {
    loginAsUser();

    livewire(CreateUser::class)
        ->fillForm(['name' => 'X', 'email' => 'not-an-email', 'password' => 'secret-password'])
        ->call('create')
        ->assertHasFormErrors(['email' => 'email']);
});

test('rejects a duplicate email', function (): void {
    loginAsUser();
    $existing = User::factory()->create();

    livewire(CreateUser::class)
        ->fillForm(['name' => 'X', 'email' => $existing->email, 'password' => 'secret-password'])
        ->call('create')
        ->assertHasFormErrors(['email' => 'unique']);
});

test('enforces the minimum password length', function (): void {
    loginAsUser();

    livewire(CreateUser::class)
        ->fillForm(['name' => 'X', 'email' => 'x@laravel.com', 'password' => 'short'])
        ->call('create')
        ->assertHasFormErrors(['password' => 'min']);
});
