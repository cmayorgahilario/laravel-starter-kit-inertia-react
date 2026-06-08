<?php

declare(strict_types=1);

test('the passkey login options respond with JSON without authentication', function (): void {
    $this->getJson('/passkeys/login/options')->assertOk();
});

test('the passkey registration options require an authenticated user', function (): void {
    $this->getJson('/user/passkeys/options')->assertUnauthorized();
});

test('an authenticated user gets passkey registration options', function (): void {
    loginAsUser();
    $this->withSession(['auth.password_confirmed_at' => now()->timestamp]);

    $this->getJson('/user/passkeys/options')->assertOk();
});
