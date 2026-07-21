<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE permission_types MODIFY limit_type ENUM('per_day', 'per_month', 'per_year') NOT NULL DEFAULT 'per_month'");
    }

    public function down(): void
    {
        DB::table('permission_types')
            ->where('limit_type', 'per_year')
            ->update(['limit_type' => 'per_month']);

        DB::statement("ALTER TABLE permission_types MODIFY limit_type ENUM('per_day', 'per_month') NOT NULL DEFAULT 'per_month'");
    }
};
