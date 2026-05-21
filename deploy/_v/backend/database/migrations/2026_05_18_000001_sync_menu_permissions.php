<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private array $permissions = [
        'manage_schedules',
        'manage_system_settings',
        'export_sales_reports',
        'export_attendance_reports',
        'export_excel_reports',
        'edit_customer_visit',
        'track_location',
    ];

    public function up(): void
    {
        foreach ($this->permissions as $slug) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $slug],
                [
                    'name' => Str::of($slug)->replace('_', ' ')->title()->toString(),
                    'group' => Str::before($slug, '_'),
                    'updated_at' => now(),
                    'created_at' => now(),
                ],
            );
        }
    }

    public function down(): void
    {
        $permissionIds = DB::table('permissions')
            ->whereIn('slug', $this->permissions)
            ->pluck('id');

        DB::table('permission_role')->whereIn('permission_id', $permissionIds)->delete();
        DB::table('permissions')->whereIn('slug', $this->permissions)->delete();
    }
};
