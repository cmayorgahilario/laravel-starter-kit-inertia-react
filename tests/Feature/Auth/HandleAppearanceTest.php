<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia as Assert;

test('middleware shares empty appearance when no cookie set', function () {
    $this->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('appearance', ''));
});

test('middleware shares dark when appearance cookie is dark', function () {
    $this->withCookie('appearance', 'dark')
        ->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('appearance', 'dark'));
});

test('middleware shares light when appearance cookie is light', function () {
    $this->withCookie('appearance', 'light')
        ->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('appearance', 'light'));
});

test('middleware shares system when appearance cookie is system', function () {
    $this->withCookie('appearance', 'system')
        ->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('appearance', 'system'));
});

test('appearance prop is available on unauthenticated pages', function () {
    $this->withCookie('appearance', 'dark')
        ->get('/')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('appearance', 'dark'));
});
