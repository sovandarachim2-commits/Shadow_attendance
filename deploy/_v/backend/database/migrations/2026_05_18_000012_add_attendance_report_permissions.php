<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $permissions = [
        ['slug' => 'reports.attendance.view_all', 'name' => 'View All Attendance Reports', 'group' => 'reports'],
        ['slug' => 'reports.attendance.view_own', 'name' => 'View Own Attendance Reports', 'group' => 'reports'],
        ['slug' => 'reports.attendance.edit', 'name' => 'Edit Attendance Reports', 'group' => 'reports'],
        ['slug' => 'reports.attendance.export', 'name' => 'Export Attendance Reports', 'group' => 'reports'],
    ];

    private array $assignToRoles = [
        'admin' => ['reports.attendance.view_all', 'reports.attendance.edit', 'reports.attendance.export'],
        'hr_manager' => ['reports.attendance.view_all', 'reports.attendance.edit', 'reports.attendance.export'],
        'accountant' => ['reports.attendance.view_all', 'reports.attendance.export'],
        'sales_manager' => ['reports.attendance.view_all', 'reports.attendance.export'],
        'outdoor_sales' => ['reports.attendance.view_own', 'reports.attendance.export'],
        'office_staff' => ['reports.attendance.view_own', 'reports.attendance.export'],
        'warehouse_staff' => ['reports.attendance.view_own', 'reports.attendance.export'],
        'driver' => ['reports.attendance.view_own', 'reports.attendance.export'],
    ];

    public function up(): void
    {
        $now = now();
        foreach ($this->permissions as $perm) {
            $exists = DB::table('permissions')->where('slug', $perm['slug'])->exists();
            if ($exists) {
                continue;
            }
            DB::table('permissions')->insert([
                'slug' => $perm['slug'],
                'name' => $perm['name'],
                'group' => $perm['group'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ($this->assignToRoles as $roleSlug => $slugs) {
            $roleId = DB::table('roles')->where('slug', $roleSlug)->value('id');
            if (! $roleId) {
                continue;
            }
            $permIds = DB::table('permissions')->whereIn('slug', $slugs)->pluck('id');
            foreach ($permIds as $permId) {
                $exists = DB::table('permission_role')
                    ->where('role_id', $roleId)
                    ->where('permission_id', $permId)
                    ->exists();
                if (! $exists) {
                    DB::table('permission_role')->insert([
                        'role_id' => $roleId,
                        'permission_id' => $permId,
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        $slugs = array_column($this->permissions, 'slug');
        $ids = DB::table('permissions')->whereIn('slug', $slugs)->pluck('id');
        DB::table('permission_role')->whereIn('permission_id', $ids)->delete();
        DB::table('permissions')->whereIn('slug', $slugs)->delete();
    }
};
