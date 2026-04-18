<?php

declare(strict_types=1);

use App\Models\Security\User;
use Inertia\Testing\AssertableInertia as Assert;

// The robertboes/inertia-breadcrumbs package uses array_filter() when serializing
// breadcrumbs, so `current: false` is omitted from non-current items. Only the
// active breadcrumb carries `current: true`.

test('dashboard breadcrumbs has 1 item with correct structure', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('breadcrumbs', 1)
            ->where('breadcrumbs.0.title', 'Dashboard')
            ->where('breadcrumbs.0.current', true)
            ->has('breadcrumbs.0.url'));
});

test('settings profile breadcrumbs has 3 items with correct hierarchy', function () {
    $user = User::factory()->create();

    // The virtual "Settings" crumb points to the same URL as "Profile" (/settings/profile),
    // so both items have current=true on this page.
    $this->actingAs($user)
        ->get('/settings/profile')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('breadcrumbs', 3)
            ->where('breadcrumbs.0.title', 'Dashboard')
            ->missing('breadcrumbs.0.current')
            ->has('breadcrumbs.0.url')
            ->where('breadcrumbs.1.title', 'Settings')
            ->where('breadcrumbs.1.current', true)
            ->has('breadcrumbs.1.url')
            ->where('breadcrumbs.2.title', 'Profile')
            ->where('breadcrumbs.2.current', true)
            ->has('breadcrumbs.2.url'));
});

test('settings password breadcrumbs has 3 items with correct hierarchy', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get('/settings/password')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('breadcrumbs', 3)
            ->where('breadcrumbs.0.title', 'Dashboard')
            ->missing('breadcrumbs.0.current')
            ->where('breadcrumbs.1.title', 'Settings')
            ->missing('breadcrumbs.1.current')
            ->where('breadcrumbs.2.title', 'Password')
            ->where('breadcrumbs.2.current', true));
});

test('settings appearance breadcrumbs has 3 items with correct hierarchy', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/appearance')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('breadcrumbs', 3)
            ->where('breadcrumbs.0.title', 'Dashboard')
            ->missing('breadcrumbs.0.current')
            ->where('breadcrumbs.1.title', 'Settings')
            ->missing('breadcrumbs.1.current')
            ->where('breadcrumbs.2.title', 'Appearance')
            ->where('breadcrumbs.2.current', true));
});

test('settings sessions breadcrumbs has 3 items with correct hierarchy', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/sessions')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('breadcrumbs', 3)
            ->where('breadcrumbs.0.title', 'Dashboard')
            ->missing('breadcrumbs.0.current')
            ->where('breadcrumbs.1.title', 'Settings')
            ->missing('breadcrumbs.1.current')
            ->where('breadcrumbs.2.title', 'Sessions')
            ->where('breadcrumbs.2.current', true));
});

test('settings notifications breadcrumbs has 3 items with correct hierarchy', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/notifications')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('breadcrumbs', 3)
            ->where('breadcrumbs.0.title', 'Dashboard')
            ->missing('breadcrumbs.0.current')
            ->where('breadcrumbs.1.title', 'Settings')
            ->missing('breadcrumbs.1.current')
            ->where('breadcrumbs.2.title', 'Notifications')
            ->where('breadcrumbs.2.current', true));
});
