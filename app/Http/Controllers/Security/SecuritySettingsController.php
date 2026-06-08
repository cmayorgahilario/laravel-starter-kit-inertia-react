<?php

declare(strict_types=1);

namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use App\Models\Security\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;
use Laravel\Passkeys\Passkey;

class SecuritySettingsController extends Controller
{
    /**
     * Show the security settings page (password, 2FA and passkeys).
     *
     * Behind the `password.confirm` middleware, so the session is freshly confirmed
     * and the sensitive actions on this page need no further prompts.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('ucp/security', [
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
            'passkeys' => $user instanceof User
                ? $user->passkeys()
                    ->latest()
                    ->get()
                    ->map(fn (Passkey $passkey): array => [
                        'id' => $passkey->id,
                        'name' => $passkey->name,
                        'authenticator' => $passkey->authenticator,
                        'created_at_diff' => $passkey->created_at?->diffForHumans(),
                        'last_used_at_diff' => $passkey->last_used_at?->diffForHumans(),
                    ])
                    ->all()
                : [],
        ]);
    }
}
