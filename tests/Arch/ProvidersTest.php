<?php

declare(strict_types=1);

use Illuminate\Support\ServiceProvider;

arch('providers')
    ->expect('App\Providers')
    ->toHaveSuffix('ServiceProvider')
    ->toExtend(ServiceProvider::class)
    ->toOnlyBeUsedIn('App\Providers');
