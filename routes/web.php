<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
});

Route::get('/dashboard', fn () => Inertia::render('dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
