<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('users') && ! Schema::hasTable('security_users')) {
            Schema::rename('users', 'security_users');
        }

        DB::table('migrations')
            ->where('migration', '0001_01_01_000000_create_users_table')
            ->update(['migration' => '0001_01_01_000000_create_security_users_table']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('security_users') && ! Schema::hasTable('users')) {
            Schema::rename('security_users', 'users');
        }

        DB::table('migrations')
            ->where('migration', '0001_01_01_000000_create_security_users_table')
            ->update(['migration' => '0001_01_01_000000_create_users_table']);
    }
};
