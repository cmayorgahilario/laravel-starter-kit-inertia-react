<?php

declare(strict_types=1);

arch('providers have ServiceProvider suffix')
    ->expect('App\Providers')
    ->toHaveSuffix('ServiceProvider')
    ->toExtend('Illuminate\Support\ServiceProvider');

arch('providers are not used by other app classes')
    ->expect('App\Providers')
    ->not->toBeUsed();
