<?php

declare(strict_types=1);

use App\Filament\Resources\Security\Users\Pages\EditUser;
use App\Models\Security\User;
use Filament\Actions\DeleteAction;
use Illuminate\Support\Facades\Hash;

use function Pest\Livewire\livewire;

test('renders with the record data', function (): void {
    loginAsUser();
    $user = User::factory()->create();

    livewire(EditUser::class, ['record' => $user->getKey()])
        ->assertOk()
        ->assertSchemaStateSet([
            'name' => $user->name,
            'email' => $user->email,
        ]);
});

test('updates the user', function (): void {
    loginAsUser();
    $user = User::factory()->create();

    livewire(EditUser::class, ['record' => $user->getKey()])
        ->fillForm(['name' => 'New Name'])
        ->call('save')
        ->assertHasNoFormErrors()
        ->assertNotified();

    expect($user->refresh()->name)->toBe('New Name');
});

test('keeps the current password when left blank', function (): void {
    loginAsUser();
    $user = User::factory()->create();
    $originalHash = $user->password;

    livewire(EditUser::class, ['record' => $user->getKey()])
        ->fillForm(['name' => 'Renamed', 'password' => ''])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($user->refresh()->password)->toBe($originalHash);
});

test('changes the password when a new one is provided', function (): void {
    loginAsUser();
    $user = User::factory()->create();

    livewire(EditUser::class, ['record' => $user->getKey()])
        ->fillForm(['password' => 'brand-new-password'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(Hash::check('brand-new-password', $user->refresh()->password))->toBeTrue();
});

test('deletes the user via the header action', function (): void {
    loginAsUser();
    $user = User::factory()->create();

    livewire(EditUser::class, ['record' => $user->getKey()])
        ->callAction(DeleteAction::class)
        ->assertNotified();

    expect(User::query()->whereKey($user->getKey())->exists())->toBeFalse();
});
