<?php

declare(strict_types=1);

use App\Models\Security\User;
use Inertia\Testing\AssertableInertia as Assert;

test('notifications page renders for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/notifications')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/notifications')
            ->has('preferences')
            ->has('status'));
});

test('notifications page requires authentication', function () {
    $this->get('/settings/notifications')
        ->assertRedirect('/login');
});

test('user can update notification preferences', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/settings/notifications', [
            'preferences' => ['email_marketing' => true, 'email_updates' => false],
        ])
        ->assertRedirect(route('settings.notifications.edit'));

    $this->assertDatabaseHas('security_users', ['id' => $user->id]);

    $user->refresh();
    expect($user->notification_preferences)->toBe(['email_marketing' => true, 'email_updates' => false]);
});

test('notification update fails when preferences field is missing', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/settings/notifications', [])
        ->assertSessionHasErrors('preferences');
});

test('notification update fails when preferences contains non-boolean values', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/settings/notifications', [
            'preferences' => ['email_marketing' => 'not-a-boolean'],
        ])
        ->assertSessionHasErrors('preferences.email_marketing');
});
