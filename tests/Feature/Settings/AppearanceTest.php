<?php

declare(strict_types=1);

use App\Models\Security\User;
use Inertia\Testing\AssertableInertia as Assert;

test('appearance page renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/appearance')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/appearance'));
});

test('appearance page requires authentication', function () {
    $this->get('/settings/appearance')
        ->assertRedirect('/login');
});
