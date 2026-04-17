<?php

declare(strict_types=1);

test('homepage title contains app name', function () {
    $this->visit('/')
        ->assertTitleContains('React Starter Kit');
});
