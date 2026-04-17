<?php

declare(strict_types=1);

test('ide helper provider is not registered in non-local environments', function () {
    // phpunit.xml sets APP_ENV=testing, so the local-only guard prevents registration
    expect(app()->environment('local'))->toBeFalse();

    expect(app()->getProviders(Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class))
        ->toBeEmpty();
});

test('app service provider registers ide helper inside local environment guard', function () {
    $source = file_get_contents(app_path('Providers/AppServiceProvider.php'));

    expect($source)->toContain('IdeHelperServiceProvider::class');
    expect($source)->toContain('class_exists');
    expect($source)->toContain("environment('local')");
});

test('ide helper package is excluded from auto-discovery', function () {
    $composer = json_decode(file_get_contents(base_path('composer.json')), true);

    $dontDiscover = $composer['extra']['laravel']['dont-discover'] ?? [];

    expect($dontDiscover)->toContain('barryvdh/laravel-ide-helper');
});

test('post-update-cmd hooks include all three ide-helper generation commands', function () {
    $composer = json_decode(file_get_contents(base_path('composer.json')), true);

    $hooks = $composer['scripts']['post-update-cmd'] ?? [];
    $hooksString = implode(' ', $hooks);

    expect($hooksString)->toContain('ide-helper:generate');
    expect($hooksString)->toContain('ide-helper:models');
    expect($hooksString)->toContain('ide-helper:meta');
});

test('ide helper provider is registered when app environment is local', function () {
    app()->detectEnvironment(fn () => 'local');

    try {
        $provider = new App\Providers\AppServiceProvider(app());
        $provider->register();

        expect(app()->getProviders(Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class))
            ->not->toBeEmpty();
    } finally {
        app()->detectEnvironment(fn () => 'testing');
    }
});

test('ide-helper:generate command runs without errors', function () {
    app()->detectEnvironment(fn () => 'local');

    try {
        $provider = new App\Providers\AppServiceProvider(app());
        $provider->register();

        $exitCode = Illuminate\Support\Facades\Artisan::call('ide-helper:generate');

        expect($exitCode)->toBe(0);
    } finally {
        app()->detectEnvironment(fn () => 'testing');
    }
});
