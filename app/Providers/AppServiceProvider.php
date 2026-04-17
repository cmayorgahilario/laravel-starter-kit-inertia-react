<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureModels();
        $this->configureCommands();
        $this->configureDates();
        $this->configureUrls();
        $this->configureVite();
        $this->configurePasswordValidation();
    }

    private function configureModels(): void
    {
        Model::unguard();

        Model::shouldBeStrict(! $this->app->isProduction());

        Model::automaticallyEagerLoadRelationships();
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands($this->app->isProduction());
    }

    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }

    private function configureUrls(): void
    {
        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }
    }

    private function configureVite(): void
    {
        Vite::prefetch();
    }

    private function configurePasswordValidation(): void
    {
        Password::defaults(fn () => Password::min(8)->mixedCase()->letters()->numbers()->uncompromised());
    }
}
