<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use Inertia\Inertia;
use Inertia\Response;

class AppearanceController
{
    public function edit(): Response
    {
        return Inertia::render('settings/appearance');
    }
}
