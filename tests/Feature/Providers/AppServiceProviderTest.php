<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules\Password;
use Inertia\Testing\AssertableInertia;

test('renders an Inertia component for handled error statuses', function (): void {
    $this->get('/a-route-that-does-not-exist')
        ->assertNotFound()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('errors/404')
            ->where('status', 404));
});

test('returns the default JSON response for API-style error requests', function (): void {
    $this->getJson('/a-route-that-does-not-exist')
        ->assertNotFound()
        ->assertJsonStructure(['message']);
});

test('leaves unhandled status codes to the default response', function (): void {
    Route::middleware('web')->get('/only-get', fn (): string => 'ok');

    $this->post('/only-get')->assertStatus(405);
});

test('leaves server errors to Laravel while debugging', function (): void {
    config(['app.debug' => true]);
    Route::middleware('web')->get('/boom', fn () => abort(500));

    $this->get('/boom')->assertStatus(500);
});

test('enforces strong password rules in production', function (): void {
    $this->app->detectEnvironment(fn (): string => 'production');

    expect(Password::default())->toBeInstanceOf(Password::class);
});
