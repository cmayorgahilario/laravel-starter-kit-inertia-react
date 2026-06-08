<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\Security\CreateNewUser;
use App\Actions\Security\ResetUserPassword;
use App\Actions\Security\UpdateUserPassword;
use App\Actions\Security\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
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
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        $this->configureViews();

        RateLimiter::for('login', function (Request $request): Limit {
            $throttleKey = Str::transliterate(Str::lower($request->string(Fortify::username())->toString()).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request): Limit {
            $loginId = $request->session()->get('login.id');

            return Limit::perMinute(5)->by(is_scalar($loginId) ? (string) $loginId : '');
        });

        RateLimiter::for('passkeys', function (Request $request): Limit {
            $credentialId = $request->string('credential.id')->toString();

            return Limit::perMinute(10)->by(
                ($credentialId !== '' ? $credentialId : $request->session()->getId()).'|'.$request->ip()
            );
        });
    }

    /**
     * Register the Inertia pages that Fortify renders for its GET auth routes.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register', [
            'passwordRules' => Password::default()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(function (Request $request) {
            $token = $request->route('token');

            return Inertia::render('auth/reset-password', [
                'email' => $request->string('email')->value(),
                'token' => is_string($token) ? $token : '',
                'passwordRules' => Password::default()->toPasswordRulesString(),
            ]);
        });

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));
    }
}
