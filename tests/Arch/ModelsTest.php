<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Database\Eloquent\Model;

arch('models are classes')
    ->expect('App\Models')
    ->toBeClasses()
    ->ignoring('App\Models\Security\Concerns');

arch('models are only consumed by allowed layers')
    ->expect('App\Models')
    ->toOnlyBeUsedIn([
        'App\Actions',
        'App\Filament',
        'App\Http',
        'App\Models',
        'App\Providers',
        'Database\Factories',
        'Database\Seeders',
    ])
    ->ignoring('App\Models\Security\Concerns');

arch('models extend eloquent')
    ->expect('App\Models')
    ->toExtend(Model::class)
    ->ignoring([User::class, 'App\Models\Security\Concerns']);
