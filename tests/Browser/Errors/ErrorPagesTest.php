<?php

declare(strict_types=1);

test('a nonexistent URL shows the 404 error page', function (): void {
    visit('/una-ruta-que-no-existe-jamas')
        ->assertSee('404')
        ->assertSee('Page not found');
});
