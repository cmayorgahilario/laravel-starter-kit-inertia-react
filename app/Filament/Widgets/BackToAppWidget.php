<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use CodeWithDennis\FilamentLucideIcons\Enums\LucideIcon;
use Filament\Widgets\Widget;

class BackToAppWidget extends Widget
{
    protected static ?int $sort = -3;

    protected string $view = 'filament.widgets.back-to-app-widget';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        return [
            'url' => route('dashboard'),
            'icon' => LucideIcon::SquareArrowOutUpRight,
        ];
    }
}
