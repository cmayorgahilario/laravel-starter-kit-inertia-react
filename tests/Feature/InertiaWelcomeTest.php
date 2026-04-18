<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia as Assert;

test('welcome page returns successful response', function () {
    $this->get('/')->assertSuccessful();
});

test('welcome page renders via inertia', function () {
    $this->get('/')->assertSee('data-page', false);
});

test('welcome page has correct inertia component', function () {
    $this->get('/')
        ->assertInertia(fn (Assert $page) => $page->component('welcome'));
});

test('inertia shares auth props', function () {
    $this->get('/')
        ->assertInertia(fn (Assert $page) => $page
            ->has('auth', fn (Assert $auth) => $auth
                ->where('user', null)
            )
        );
});

test('inertia shares app name', function () {
    $this->get('/')
        ->assertInertia(fn (Assert $page) => $page
            ->has('app', fn (Assert $app) => $app
                ->where('name', config('app.name'))
            )
        );
});
