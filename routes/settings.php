<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\Settings\NotificationController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SessionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('settings')->name('settings.')->group(function (): void {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('/appearance', [AppearanceController::class, 'edit'])->name('appearance.edit');

    Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.index');
    Route::delete('/sessions', [SessionController::class, 'destroy'])->name('sessions.destroy');

    Route::get('/notifications', [NotificationController::class, 'edit'])->name('notifications.edit');
    Route::patch('/notifications', [NotificationController::class, 'update'])->name('notifications.update');
});
