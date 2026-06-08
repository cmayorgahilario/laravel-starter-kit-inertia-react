<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Security\Passkey;
use App\Models\Security\PersonalAccessToken;
use App\Models\Security\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;
use Laravel\Passkeys\Passkeys;
use Laravel\Sanctum\Sanctum;

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
        $this->configureCommands();
        $this->configureModels();
        $this->configurePasswordValidation();
        $this->configureDates();
        $this->configureSanctum();
        $this->configurePasskeys();
        $this->configureInertiaExceptions();
    }

    /**
     * Configure the application's commands.
     */
    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            $this->app->isProduction()
        );
    }

    /**
     * Configure the dates.
     */
    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }

    /**
     * Render error pages as Inertia responses through Inertia's own exception
     * pipeline (so version, root view and shared data are set correctly).
     */
    private function configureInertiaExceptions(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response): ?ExceptionResponse {
            $request = $response->request;

            // JSON / API clients keep Laravel's default (JSON) error response.
            if ($request->expectsJson() || $request->is('api/*')) {
                return null;
            }

            $status = $response->statusCode();
            $alwaysInertia = [403, 404, 419, 429];

            if (! in_array($status, [...$alwaysInertia, 500, 503], true)) {
                return null;
            }

            // Keep Laravel's debug page for 500/503 while APP_DEBUG is on.
            if ($this->app->hasDebugModeEnabled() && ! in_array($status, $alwaysInertia, true)) {
                return null;
            }

            return $response
                ->render('errors/'.$status, ['status' => $status])
                ->withSharedData();
        });
    }

    /**
     * Configure the models.
     */
    private function configureModels(): void
    {
        Model::shouldBeStrict(! $this->app->isProduction());
        Model::unguard();
    }

    /**
     * Configure the passkeys.
     */
    private function configurePasskeys(): void
    {
        Passkeys::useUserModel(User::class);
        Passkeys::usePasskeyModel(Passkey::class);
    }

    /**
     * Configure the password validation rules.
     */
    private function configurePasswordValidation(): void
    {
        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(8)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure Sanctum.
     */
    private function configureSanctum(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
