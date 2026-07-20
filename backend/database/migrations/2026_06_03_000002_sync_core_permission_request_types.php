<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $types = [
        [
            'name' => 'Late Check In',
            'allowed_times' => 1,
            'limit_type' => 'per_month',
            'duration_control' => 'hours',
            'max_hours' => 2,
            'deduction_amount' => 0,
            'color' => '#3b82f6',
            'description' => 'Request approval for late arrival.',
        ],
        [
            'name' => 'Early Check Out',
            'allowed_times' => 1,
            'limit_type' => 'per_month',
            'duration_control' => 'hours',
            'max_hours' => 2,
            'deduction_amount' => 0,
            'color' => '#f59e0b',
            'description' => 'Request approval to leave early.',
        ],
        [
            'name' => 'Day Off',
            'allowed_times' => 1,
            'limit_type' => 'per_month',
            'duration_control' => 'any',
            'max_hours' => null,
            'deduction_amount' => 0,
            'color' => '#8b5cf6',
            'description' => 'Request approval for a day off.',
        ],
        [
            'name' => 'Missing Check In',
            'allowed_times' => 1,
            'limit_type' => 'per_month',
            'duration_control' => 'hours',
            'max_hours' => null,
            'deduction_amount' => 0,
            'color' => '#ef4444',
            'description' => 'Request approval for missing check-in records.',
        ],
        [
            'name' => 'Missing Check Out',
            'allowed_times' => 1,
            'limit_type' => 'per_month',
            'duration_control' => 'hours',
            'max_hours' => null,
            'deduction_amount' => 0,
            'color' => '#d946ef',
            'description' => 'Request approval for missing check-out records.',
        ],
        [
            'name' => 'Personal Leave',
            'allowed_times' => 1,
            'limit_type' => 'per_month',
            'duration_control' => 'any',
            'max_hours' => null,
            'deduction_amount' => 0,
            'color' => '#f97316',
            'description' => 'Request approval for personal leave.',
        ],
    ];

    public function up(): void
    {
        $now = now();
        $names = array_column($this->types, 'name');

        DB::table('permission_requests')
            ->whereIn('type', ['Personal Permission', 'Request Permission', 'Custom Request'])
            ->update(['type' => 'Personal Leave']);

        DB::table('permission_requests')
            ->whereIn('type', ['Manual Check In', 'Missing Attendance', 'Attendance Edit'])
            ->update(['type' => 'Missing Check In']);

        DB::table('permission_requests')
            ->whereIn('type', ['Leave Request', 'Sick Leave', 'Emergency Leave'])
            ->update(['type' => 'Day Off']);

        DB::table('permission_requests')
            ->where('type', 'Early Leave')
            ->update(['type' => 'Early Check Out']);

        DB::table('permission_requests')
            ->whereIn('type', ['Outdoor Work', 'Work From Home', 'Overtime'])
            ->update(['type' => 'Personal Leave']);

        DB::table('permission_types')->whereNotIn('name', $names)->delete();

        foreach ($this->types as $type) {
            DB::table('permission_types')->updateOrInsert(
                ['name' => $type['name']],
                [...$type, 'updated_at' => $now, 'created_at' => $now],
            );
        }
    }

    public function down(): void
    {
        DB::table('permission_types')
            ->whereIn('name', array_column($this->types, 'name'))
            ->delete();
    }
};
