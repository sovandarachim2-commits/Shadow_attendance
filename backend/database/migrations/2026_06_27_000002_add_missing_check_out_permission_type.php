<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('permission_types')->updateOrInsert(
            ['name' => 'Missing Check Out'],
            [
                'allowed_times' => 1,
                'limit_type' => 'per_month',
                'duration_control' => 'hours',
                'max_hours' => null,
                'deduction_amount' => 0,
                'color' => '#d946ef',
                'description' => 'Request approval for missing check-out records.',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );
    }

    public function down(): void
    {
        DB::table('permission_types')
            ->where('name', 'Missing Check Out')
            ->delete();
    }
};
