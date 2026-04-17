<?php

arch('models extend eloquent model')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch('no debug functions')
    ->expect(['dd', 'dump', 'ray'])
    ->not->toBeUsed();

arch('controllers have Controller suffix')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');

arch('providers have ServiceProvider suffix')
    ->expect('App\Providers')
    ->toHaveSuffix('ServiceProvider');

arch()->preset()->php();

arch()->preset()->security();
