<?php

declare(strict_types=1);

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Http\FormRequest;

arch('controllers')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller')
    ->ignoring(Controller::class);

arch('middleware')
    ->expect('App\Http\Middleware')
    ->toBeClasses();

arch('requests')
    ->expect('App\Http\Requests')
    ->toHaveSuffix('Request')
    ->toExtend(FormRequest::class);
