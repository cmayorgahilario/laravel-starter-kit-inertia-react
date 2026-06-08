<?php

declare(strict_types=1);

namespace App\Models\Security\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Centralizes avatar storage and URL resolution for a model exposing
 * a nullable `avatar_path` column and a `name` attribute.
 */
trait HasProfilePhoto
{
    /**
     * Store a new avatar on the avatar disk, replacing any previous file.
     */
    public function updateAvatar(UploadedFile $photo): void
    {
        $previous = $this->avatar_path;

        $this->forceFill([
            'avatar_path' => $photo->storePublicly($this->avatarDirectory(), ['disk' => $this->avatarDisk()]),
        ])->save();

        if ($previous !== null) {
            Storage::disk($this->avatarDisk())->delete($previous);
        }
    }

    /**
     * Remove the current avatar, falling back to the generated one.
     */
    public function deleteAvatar(): void
    {
        if ($this->avatar_path === null) {
            return;
        }

        Storage::disk($this->avatarDisk())->delete($this->avatar_path);

        $this->forceFill(['avatar_path' => null])->save();
    }

    /**
     * Avatar URL for the Filament panel (null lets Filament render its own default).
     */
    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_path !== null ? $this->avatar_url : null;
    }

    /**
     * The disk where avatars are stored (decoupled from the default filesystem).
     */
    public function avatarDisk(): string
    {
        return Config::string('avatars.disk');
    }

    /**
     * The directory within the avatar disk where files are stored.
     */
    public function avatarDirectory(): string
    {
        return Config::string('avatars.directory');
    }

    /**
     * The user's avatar URL, or a generated fallback when no photo is set.
     *
     * @return Attribute<string, never>
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn (): string => $this->avatar_path !== null
                ? Storage::disk($this->avatarDisk())->url($this->avatar_path)
                : $this->defaultAvatarUrl(),
        );
    }

    /**
     * Build a deterministic fallback avatar from the user's initials.
     */
    private function defaultAvatarUrl(): string
    {
        $initials = Str::of($this->name)
            ->explode(' ')
            ->map(fn (string $segment): string => Str::substr($segment, 0, 1))
            ->take(2)
            ->implode('');

        return 'https://ui-avatars.com/api/?name='.urlencode($initials).'&background=D97706&color=FFFFFF';
    }
}
