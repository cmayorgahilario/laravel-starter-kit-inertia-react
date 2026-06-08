<?php

declare(strict_types=1);

use App\Filament\Resources\Security\Users\Pages\ListUsers;
use App\Models\Security\User;

use function Pest\Livewire\livewire;

test('renders the index page', function (): void {
    loginAsUser();

    livewire(ListUsers::class)->assertOk();
});

test('lists users', function (): void {
    loginAsUser();
    $users = User::factory()->count(3)->create();

    livewire(ListUsers::class)->assertCanSeeTableRecords($users);
});

test('renders the configured columns', function (): void {
    loginAsUser();

    livewire(ListUsers::class)
        ->assertCanRenderTableColumn('name')
        ->assertCanRenderTableColumn('email')
        ->assertCanRenderTableColumn('created_at');
});

test('searches users by name', function (): void {
    loginAsUser();
    $users = User::factory()->count(3)->create();
    $target = $users->first();

    livewire(ListUsers::class)
        ->searchTable($target->name)
        ->assertCanSeeTableRecords($users->where('id', $target->id))
        ->assertCanNotSeeTableRecords($users->where('id', '!=', $target->id));
});

test('sorts users by name', function (): void {
    loginAsUser();
    User::factory()->count(3)->create();

    livewire(ListUsers::class)
        ->sortTable('name')
        ->assertOk();
});

test('filters users by verification status', function (): void {
    loginAsUser();
    $verified = User::factory()->create();
    $unverified = User::factory()->unverified()->create();

    livewire(ListUsers::class)
        ->filterTable('email_verified', 'verified')
        ->assertCanSeeTableRecords([$verified])
        ->assertCanNotSeeTableRecords([$unverified]);

    livewire(ListUsers::class)
        ->filterTable('email_verified', 'unverified')
        ->assertCanSeeTableRecords([$unverified])
        ->assertCanNotSeeTableRecords([$verified]);
});

test('filters users by registration date range', function (): void {
    loginAsUser();
    $user = User::factory()->create();

    livewire(ListUsers::class)
        ->filterTable('created_at', [
            'created_from' => now()->subDay()->toDateString(),
            'created_until' => now()->addDay()->toDateString(),
        ])
        ->assertCanSeeTableRecords([$user]);
});
