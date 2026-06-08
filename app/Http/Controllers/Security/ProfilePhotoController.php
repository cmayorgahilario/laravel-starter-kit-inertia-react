<?php

declare(strict_types=1);

namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use App\Models\Security\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfilePhotoController extends Controller
{
    /**
     * Remove the authenticated user's avatar, falling back to the generated one.
     */
    public function destroy(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->deleteAvatar();

        return response()->json(['avatar_url' => $user->avatar_url]);
    }
}
