<?php

declare(strict_types=1);

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail): void {
    $trail->push('Dashboard', route('dashboard'));
});

Breadcrumbs::for('settings', function (BreadcrumbTrail $trail): void {
    $trail->parent('dashboard');
    $trail->push('Settings', route('settings.profile.edit'));
});

Breadcrumbs::for('settings.profile.edit', function (BreadcrumbTrail $trail): void {
    $trail->parent('settings');
    $trail->push('Profile', route('settings.profile.edit'));
});

Breadcrumbs::for('settings.password.edit', function (BreadcrumbTrail $trail): void {
    $trail->parent('settings');
    $trail->push('Password', route('settings.password.edit'));
});

Breadcrumbs::for('settings.appearance.edit', function (BreadcrumbTrail $trail): void {
    $trail->parent('settings');
    $trail->push('Appearance', route('settings.appearance.edit'));
});

Breadcrumbs::for('settings.sessions.index', function (BreadcrumbTrail $trail): void {
    $trail->parent('settings');
    $trail->push('Sessions', route('settings.sessions.index'));
});

Breadcrumbs::for('settings.notifications.edit', function (BreadcrumbTrail $trail): void {
    $trail->parent('settings');
    $trail->push('Notifications', route('settings.notifications.edit'));
});
