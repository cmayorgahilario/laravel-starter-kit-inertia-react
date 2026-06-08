<?php

declare(strict_types=1);

namespace Database\Seeders\Security;

use App\Models\Security\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'email' => 'admin@yourdomain.com',
        ]);
    }
}
