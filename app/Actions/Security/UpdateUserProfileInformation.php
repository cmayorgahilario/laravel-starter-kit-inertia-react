<?php

declare(strict_types=1);

namespace App\Actions\Security;

use App\Models\Security\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array<string, mixed>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ])->validate();

        $photo = $input['photo'] ?? null;

        if ($photo instanceof UploadedFile) {
            $user->updateAvatar($photo);
        }

        if ($input['email'] !== $user->email) {
            $user->forceFill([
                'name' => $input['name'],
                'email' => $input['email'],
                'email_verified_at' => null,
            ])->save();

            $user->sendEmailVerificationNotification();

            return;
        }

        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
        ])->save();
    }
}
