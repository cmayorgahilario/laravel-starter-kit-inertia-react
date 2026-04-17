<?php

namespace Tests\Feature;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rules\Password;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    public function test_models_are_unguarded(): void
    {
        $this->assertTrue(Model::isUnguarded());
    }

    public function test_dates_use_carbon_immutable(): void
    {
        $this->assertInstanceOf(CarbonImmutable::class, now());
    }

    public function test_password_defaults_require_min_eight_characters(): void
    {
        $rule = Password::defaults();

        $this->assertInstanceOf(Password::class, $rule);

        $validator = validator(['password' => 'short'], ['password' => $rule]);
        $this->assertTrue($validator->fails());

        $validator = validator(['password' => 'ValidPass1!'], ['password' => $rule]);
        $this->assertTrue($validator->passes());
    }

    public function test_application_boots_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
