<?php

declare(strict_types=1);

arch('no debug functions')
    ->expect(['dd', 'dump', 'ray', 'die', 'var_dump'])
    ->not->toBeUsed();

arch('no sleep functions')
    ->expect(['sleep', 'usleep'])
    ->not->toBeUsed();

arch()->preset()->php();

arch()->preset()->security();
