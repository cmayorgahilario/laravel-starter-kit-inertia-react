<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Security\User;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user instanceof User ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                    'avatar_url' => $user->avatar_url,
                    'two_factor_enabled' => $user->hasEnabledTwoFactorAuthentication(),
                    'can_access_admin' => $user->canAccessPanel(Filament::getDefaultPanel()),
                ] : null,
            ],
            'features' => [
                'browserSessions' => config('session.driver') === 'database',
            ],
            'flash' => [
                'toast' => $request->hasSession() ? $request->session()->get('toast') : null,
            ],
        ];
    }
}
