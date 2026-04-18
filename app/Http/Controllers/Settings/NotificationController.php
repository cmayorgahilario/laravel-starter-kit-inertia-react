<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/notifications', [
            'preferences' => $request->user()->notification_preferences ?? [],
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'preferences' => ['required', 'array'],
            'preferences.*' => ['boolean'],
        ]);

        $request->user()->update([
            'notification_preferences' => $validated['preferences'],
        ]);

        return to_route('settings.notifications.edit')->with('status', 'notifications-updated');
    }
}
