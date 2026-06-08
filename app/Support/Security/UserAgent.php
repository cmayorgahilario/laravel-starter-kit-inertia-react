<?php

declare(strict_types=1);

namespace App\Support\Security;

use Illuminate\Support\Str;

/**
 * A friendly browser and platform derived from a raw user-agent string.
 */
readonly class UserAgent
{
    public function __construct(
        public string $browser,
        public string $platform,
    ) {}

    /**
     * Parse a raw user-agent string into a value object.
     */
    public static function parse(string $userAgent): self
    {
        return new self(
            browser: self::browser($userAgent),
            platform: self::platform($userAgent),
        );
    }

    /**
     * @return array{browser: string, platform: string}
     */
    public function toArray(): array
    {
        return ['browser' => $this->browser, 'platform' => $this->platform];
    }

    private static function browser(string $userAgent): string
    {
        return match (true) {
            Str::contains($userAgent, 'Edg') => 'Edge',
            Str::contains($userAgent, ['OPR', 'Opera']) => 'Opera',
            Str::contains($userAgent, 'Firefox') => 'Firefox',
            Str::contains($userAgent, 'Chrome') => 'Chrome',
            Str::contains($userAgent, 'Safari') => 'Safari',
            default => 'Navegador',
        };
    }

    private static function platform(string $userAgent): string
    {
        return match (true) {
            Str::contains($userAgent, 'Windows') => 'Windows',
            Str::contains($userAgent, ['iPhone', 'iPad']) => 'iOS',
            Str::contains($userAgent, 'Android') => 'Android',
            Str::contains($userAgent, 'Mac') => 'macOS',
            Str::contains($userAgent, 'Linux') => 'Linux',
            default => 'Desconocido',
        };
    }
}
