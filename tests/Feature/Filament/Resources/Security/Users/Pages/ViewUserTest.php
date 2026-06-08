<?php

declare(strict_types=1);

use App\Filament\Resources\Security\Users\Pages\ViewUser;
use App\Models\Security\User;

use function Pest\Livewire\livewire;

// Both verification states are tested to cover the email_verified_at state()/color() closures.
test('renders a verified user', function (): void {
    loginAsUser();
    $user = User::factory()->create();

    livewire(ViewUser::class, ['record' => $user->getKey()])
        ->assertOk()
        ->assertSee($user->name)
        ->assertSee($user->email);
});

test('renders an unverified user', function (): void {
    loginAsUser();
    $user = User::factory()->unverified()->create();

    livewire(ViewUser::class, ['record' => $user->getKey()])
        ->assertOk()
        ->assertSee($user->name);
});
