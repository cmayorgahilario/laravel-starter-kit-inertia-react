<?php

declare(strict_types=1);

use App\Support\Security\UserAgent;

test('detects the browser from a raw user-agent string', function (string $userAgent, string $browser): void {
    expect(UserAgent::parse($userAgent)->browser)->toBe($browser);
})->with([
    'edge' => ['Mozilla/5.0 (Windows NT 10.0) Chrome/120 Safari/537.36 Edg/120', 'Edge'],
    'opera' => ['Mozilla/5.0 Chrome/120 Safari/537.36 OPR/106', 'Opera'],
    'firefox' => ['Mozilla/5.0 (Windows NT 10.0; rv:121.0) Gecko/20100101 Firefox/121.0', 'Firefox'],
    'chrome' => ['Mozilla/5.0 (Windows NT 10.0) Chrome/120 Safari/537.36', 'Chrome'],
    'safari' => ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/17 Safari/605.1.15', 'Safari'],
    'unknown' => ['something-weird', 'Navegador'],
    'empty' => ['', 'Navegador'],
]);

test('detects the platform from a raw user-agent string', function (string $userAgent, string $platform): void {
    expect(UserAgent::parse($userAgent)->platform)->toBe($platform);
})->with([
    'windows' => ['Mozilla/5.0 (Windows NT 10.0) Chrome/120', 'Windows'],
    'iphone' => ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1', 'iOS'],
    'ipad' => ['Mozilla/5.0 (iPad; CPU OS 17_0) Safari/604.1', 'iOS'],
    'android' => ['Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile', 'Android'],
    'macos' => ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Safari/605.1.15', 'macOS'],
    'linux' => ['Mozilla/5.0 (X11; Linux x86_64) Firefox/121.0', 'Linux'],
    'unknown' => ['something-weird', 'Desconocido'],
    'empty' => ['', 'Desconocido'],
]);

test('android wins over the linux token it contains', function (): void {
    expect(UserAgent::parse('Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile')->platform)->toBe('Android');
});

test('exposes itself as an array for the session view model', function (): void {
    expect(UserAgent::parse('Mozilla/5.0 (Windows NT 10.0) Chrome/120')->toArray())
        ->toBe(['browser' => 'Chrome', 'platform' => 'Windows']);
});
