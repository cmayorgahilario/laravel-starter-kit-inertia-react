<?php

declare(strict_types=1);

use App\Filament\Widgets\BackToAppWidget;

use function Pest\Livewire\livewire;

test('renders the back to app widget', function (): void {
    loginAsUser();

    livewire(BackToAppWidget::class)->assertOk();
});
