<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $permissions = [
        ['slug' => 'employee_report.view_all', 'name' => 'View All Employee Monthly Reports', 'group' => 'reports'],
        ['slug' => 'employee_report.view_own', 'name' => 'View Own Employee Monthly Report', 'group' => 'reports'],
        ['slug' => 'employee_report.export', 'name' => 'Export Employee Monthly Reports', 'group' => 'reports'],
    ];

    private array $assignToRoles = [
        'admin'           => ['employee_report.view_all', 'employee_report.export'],
        'hr_manager'      => ['employee_report.view_all', 'employee_report.export'],
        'accountant'      => ['employee_report.view_all', 'employee_report.export'],
        'sales_manager'   => ['employee_report.view_all', 'employee_report.export'],
        'outdoor_sales'   => ['employee_report.view_own', 'employee_report.export'],
        'office_staff'    => ['employee_report.view_own', 'employee_report.export'],
        'warehouse_staff' => ['employee_report.view_own', 'employee_report.export'],
        'driver'          => ['employee_report.view_own', 'employee_report.export'],
    ];

    public function up(): void
    {
        $now = now();

        foreach ($this->permissions as $perm) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $perm['slug']],
                [
                    'name'       => $perm['name'],
                    'group'      => $perm['group'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }

        foreach ($this->assignToRoles as $roleSlug => $slugs) {
            $roleId = DB::table('roles')->where('slug', $roleSlug)->value('id');
            if (! $roleId) {
                continue;
            }

            $permIds = DB::table('permissions')->whereIn('slug', $slugs)->pluck('id');

            foreach ($permIds as $permId) {
                DB::table('permission_role')->updateOrInsert(
                    ['role_id' => $roleId, 'permission_id' => $permId],
                    [],
                );
            }
        }
    }

    public function down(): void
    {
        $slugs = array_column($this->permissions, 'slug');
        $ids   = DB::table('permissions')->whereIn('slug', $slugs)->pluck('id');

        DB::table('permission_role')->whereIn('permission_id', $ids)->delete();
        DB::table('permissions')->whereIn('slug', $slugs)->delete();
    }
};
