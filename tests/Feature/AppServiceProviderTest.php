<?php

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rules\Password;

test('models are unguarded', function () {
    expect(Model::isUnguarded())->toBeTrue();
});

test('dates use carbon immutable', function () {
    expect(now())->toBeInstanceOf(CarbonImmutable::class);
});

test('password defaults require min eight characters', function () {
    $rule = Password::defaults();

    expect($rule)->toBeInstanceOf(Password::class);

    $validator = validator(['password' => 'short'], ['password' => $rule]);
    expect($validator->fails())->toBeTrue();

    $validator = validator(['password' => 'ValidPass1!'], ['password' => $rule]);
    expect($validator->passes())->toBeTrue();
});

test('application boots successfully', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
});
