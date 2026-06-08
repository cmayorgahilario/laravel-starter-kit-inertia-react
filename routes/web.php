<?php

declare(strict_types=1);

use App\Http\Controllers\Security\BrowserSessionsController;
use App\Http\Controllers\Security\DeleteAccountController;
use App\Http\Controllers\Security\ProfilePhotoController;
use App\Http\Controllers\Security\SecuritySettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', static fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/dashboard', static fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::prefix('ucp')->name('ucp.')->group(function (): void {
        Route::get('/profile', static fn () => Inertia::render('ucp/profile'))->name('profile');
        Route::get('/password', static fn () => Inertia::render('ucp/password'))->name('password');
        Route::get('/security', [SecuritySettingsController::class, 'show'])
            ->middleware('password.confirm')
            ->name('security');
        Route::get('/sessions', [BrowserSessionsController::class, 'index'])->name('sessions');
        Route::delete('/sessions', [BrowserSessionsController::class, 'destroyOthers'])->name('sessions.destroy');
        Route::delete('/account', [DeleteAccountController::class, 'destroy'])->name('account.destroy');
    });
});

Route::delete('/user/profile-photo', [ProfilePhotoController::class, 'destroy'])
    ->middleware('auth')
    ->name('profile-photo.destroy');
