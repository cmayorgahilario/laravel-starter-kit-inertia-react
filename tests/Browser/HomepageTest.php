<?php

test('homepage title contains app name', function () {
    $this->visit('/')
        ->assertTitleContains('React Starter Kit');
});
