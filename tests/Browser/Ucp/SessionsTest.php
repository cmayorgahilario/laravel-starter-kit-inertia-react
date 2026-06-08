<?php

declare(strict_types=1);

test('the sessions page shows the active sessions', function (): void {
    // The screen is only available with the database session driver (tests default
    // to the array driver, which would 404 via BrowserSessionsController's guard).
    config(['session.driver' => 'database']);

    loginAsUser();

    visit('/ucp/sessions')->assertSee('Active sessions');
});
