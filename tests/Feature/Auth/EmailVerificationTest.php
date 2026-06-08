<?php

declare(strict_types=1);

use App\Models\Security\User;
use Illuminate\Support\Facades\URL;

test('a user can verify their email with a signed link', function (): void {
    $user = User::factory()->unverified()->create();
    $this->actingAs($user);

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1((string) $user->email)],
    );

    $this->get($url);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

test('an invalid hash does not verify the email', function (): void {
    $user = User::factory()->unverified()->create();
    $this->actingAs($user);

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email')],
    );

    $this->get($url)->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});
