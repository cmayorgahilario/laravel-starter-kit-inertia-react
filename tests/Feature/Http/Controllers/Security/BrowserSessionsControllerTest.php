<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;

beforeEach(fn () => config(['session.driver' => 'database']));

test('the sessions index renders the active sessions with parsed agents', function (): void {
    $user = loginAsUser();

    $userAgents = [
        'Mozilla/5.0 (Windows NT 10.0) Edg/120',
        'Mozilla/5.0 (iPhone) OPR/80',
        'Mozilla/5.0 (X11; Linux) Firefox/120',
        'Mozilla/5.0 (Android 13) Chrome/120 Safari/537',
        'Mozilla/5.0 (Macintosh) Version/17 Safari/605',
        'Mozilla/5.0 (iPad) Opera/80',
        'curl/8.0',
    ];

    foreach ($userAgents as $index => $userAgent) {
        DB::table('sessions')->insert([
            'id' => 'session-'.$index,
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => $userAgent,
            'payload' => '',
            'last_activity' => now()->timestamp,
        ]);
    }

    $this->get('/ucp/sessions')->assertOk();
});

test('a user can log out other browser sessions', function (): void {
    $user = loginAsUser();

    DB::table('sessions')->insert([
        'id' => 'other-session',
        'user_id' => $user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0) Chrome/120',
        'payload' => '',
        'last_activity' => now()->timestamp,
    ]);

    $this->delete('/ucp/sessions', ['password' => 'Password123!'])->assertRedirect();

    $this->assertDatabaseMissing('sessions', ['id' => 'other-session']);
});

test('logging out other sessions requires the correct password', function (): void {
    loginAsUser();

    $this->from('/ucp/sessions')
        ->delete('/ucp/sessions', ['password' => 'wrong-password'])
        ->assertRedirect('/ucp/sessions');
});

test('the sessions index is not available when the driver is not database', function (): void {
    config(['session.driver' => 'array']);

    loginAsUser();

    $this->get('/ucp/sessions')->assertNotFound();
});
