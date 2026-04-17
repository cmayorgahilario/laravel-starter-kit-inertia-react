<?php

declare(strict_types=1);

arch('controllers have Controller suffix')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller')
    ->toExtendNothing();

arch('controllers are not used by other app classes')
    ->expect('App\Http\Controllers')
    ->not->toBeUsed();
