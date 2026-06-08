<?php

declare(strict_types=1);

namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use App\Models\Security\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeleteAccountController extends Controller
{
    /**
     * Delete the authenticated user's account.
     *
     * Passkeys cascade on delete; the avatar file is removed explicitly since
     * deleting the row does not touch the storage disk.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('deleteAccount', [
            'password' => ['required', 'current_password:web'],
        ]);

        $user = $request->user();

        // Sign out before deleting: logout() can re-persist the user through the
        // remember-token cycle and would resurrect the already-deleted row.
        Auth::logout();

        if ($user instanceof User) {
            $user->deleteAvatar();
            $user->delete();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
