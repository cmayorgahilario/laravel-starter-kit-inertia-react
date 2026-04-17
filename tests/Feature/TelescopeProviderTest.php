<?php

declare(strict_types=1);

test('telescope providers are not registered in non-local environments', function () {
    // phpunit.xml sets APP_ENV=testing, so the local-only guard prevents registration
    expect(app()->environment('local'))->toBeFalse();

    expect(app()->getProviders(Laravel\Telescope\TelescopeServiceProvider::class))
        ->toBeEmpty();

    expect(app()->getProviders(Fruitcake\TelescopeToolbar\ToolbarServiceProvider::class))
        ->toBeEmpty();
});

test('app service provider has local environment guard for telescope registration', function () {
    $source = file_get_contents(app_path('Providers/AppServiceProvider.php'));

    expect($source)->toContain("environment('local')");
    expect($source)->toContain('TelescopeServiceProvider');
    expect($source)->toContain('ToolbarServiceProvider');
    expect($source)->toContain('class_exists');
});

test('telescope and toolbar packages are excluded from auto-discovery', function () {
    $composer = json_decode(file_get_contents(base_path('composer.json')), true);

    $dontDiscover = $composer['extra']['laravel']['dont-discover'] ?? [];

    expect($dontDiscover)->toContain('laravel/telescope');
    expect($dontDiscover)->toContain('fruitcake/laravel-telescope-toolbar');
});

test('telescope env vars are present in env example', function () {
    $envExample = file_get_contents(base_path('.env.example'));

    expect($envExample)->toContain('TELESCOPE_ENABLED=true');
    expect($envExample)->toContain('TELESCOPE_TOOLBAR_ENABLED=false');
});

test('telescope prune schedule is defined', function () {
    $schedule = app(Illuminate\Console\Scheduling\Schedule::class);

    $commands = collect($schedule->events())
        ->map(fn ($event) => $event->command ?? '')
        ->filter(fn ($cmd) => str_contains($cmd, 'telescope:prune'));

    expect($commands)->not->toBeEmpty();
});

test('bootstrap providers does not auto-register telescope', function () {
    $providers = require base_path('bootstrap/providers.php');

    expect($providers)->not->toContain(App\Providers\TelescopeServiceProvider::class);
    expect($providers)->not->toContain(Laravel\Telescope\TelescopeServiceProvider::class);
});

test('telescope providers are registered when app environment is local', function () {
    // Change env to local to exercise the register() guard branch
    app()->detectEnvironment(fn () => 'local');

    try {
        $provider = new App\Providers\AppServiceProvider(app());
        $provider->register();

        expect(app()->getProviders(Laravel\Telescope\TelescopeServiceProvider::class))
            ->not->toBeEmpty();
        expect(app()->getProviders(Fruitcake\TelescopeToolbar\ToolbarServiceProvider::class))
            ->not->toBeEmpty();
    } finally {
        app()->detectEnvironment(fn () => 'testing');
    }
});
