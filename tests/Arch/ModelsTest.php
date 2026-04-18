<?php

declare(strict_types=1);

arch('models extend eloquent model')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model')
    ->toHaveMethod('casts')
    ->ignoring('App\Models\Concerns');

arch('models are only used in expected namespaces')
    ->expect('App\Models')
    ->toOnlyBeUsedIn([
        'App\Actions',
        'App\Http\Controllers',
        'App\Providers',
        'Database\Factories',
        'Database\Seeders',
    ]);
