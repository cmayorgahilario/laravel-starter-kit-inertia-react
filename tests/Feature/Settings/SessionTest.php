<?php

declare(strict_types=1);

use App\Models\Security\User;
use Inertia\Testing\AssertableInertia as Assert;

test('sessions page renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/sessions')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/sessions')
            ->has('sessions')
            ->has('status'));
});

test('sessions page requires authentication', function () {
    $this->get('/settings/sessions')
        ->assertRedirect('/login');
});

test('user can log out other sessions with correct password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete('/settings/sessions', ['password' => 'password'])
        ->assertRedirect(route('settings.sessions.index'));
});

test('logout other sessions fails with wrong password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete('/settings/sessions', ['password' => 'wrong-password'])
        ->assertSessionHasErrors('password');
});
