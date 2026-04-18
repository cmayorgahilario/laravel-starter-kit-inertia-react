<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Actions\Fortify\UpdateUserPassword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController
{
    public function edit(): Response
    {
        return Inertia::render('settings/password', [
            'status' => session('status'),
        ]);
    }

    public function update(Request $request, UpdateUserPassword $updater): RedirectResponse
    {
        $updater->update($request->user(), $request->all());

        return to_route('settings.password.edit')->with('status', 'password-updated');
    }
}
