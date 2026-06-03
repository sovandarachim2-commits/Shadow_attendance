<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('permission_requests')
            ->where('type', 'Missing Attendance')
            ->update(['type' => 'Missing Check In']);

        DB::table('permission_types')
            ->where('name', 'Missing Attendance')
            ->delete();

        DB::table('permission_types')->updateOrInsert(
            ['name' => 'Missing Check In'],
            [
                'allowed_times' => 1,
                'limit_type' => 'per_month',
                'duration_control' => 'hours',
                'max_hours' => null,
                'deduction_amount' => 0,
                'color' => '#8b5cf6',
                'description' => 'Request approval for missing check-in records.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );
    }

    public function down(): void
    {
        DB::table('permission_requests')
            ->where('type', 'Missing Check In')
            ->update(['type' => 'Missing Attendance']);

        DB::table('permission_types')
            ->where('name', 'Missing Check In')
            ->update([
                'name' => 'Missing Attendance',
                'description' => 'Request approval for missing check-in or check-out records.',
                'updated_at' => now(),
            ]);
    }
};
