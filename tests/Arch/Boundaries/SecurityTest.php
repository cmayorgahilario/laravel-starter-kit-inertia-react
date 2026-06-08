<?php

declare(strict_types=1);

// Domain boundary — add an equivalent rule per domain as new ones appear.
arch('Security models are only consumed by allowed layers')
    ->expect('App\Models\Security')
    ->toOnlyBeUsedIn([
        'App\Models\Security',
        'App\Actions',
        'App\Filament',
        'App\Http',
        'App\Providers',
        'Database\Factories',
        'Database\Seeders',
    ]);
