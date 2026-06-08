<?php

declare(strict_types=1);

use App\Models\Security\User;
use TimoKoerber\LaravelOneTimeOperations\OneTimeOperation;

return new class extends OneTimeOperation
{
    public function process(): void
    {
        $founder = config('auth.founder');

        if (blank($founder['name']) || blank($founder['email']) || blank($founder['password'])) {
            throw new RuntimeException(
                'Founder credentials are not configured. Please set AUTH_FOUNDER_NAME, AUTH_FOUNDER_EMAIL and AUTH_FOUNDER_PASSWORD.'
            );
        }

        $user = User::firstOrNew(['email' => $founder['email']]);

        $user->name = $founder['name'];
        $user->password = $founder['password'];
        $user->markEmailAsVerified();
    }
};
