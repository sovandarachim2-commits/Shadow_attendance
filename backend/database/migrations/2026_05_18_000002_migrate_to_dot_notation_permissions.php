<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $permissions = [
        // Dashboard
        ['slug' => 'dashboard.admin',       'name' => 'Admin Dashboard',       'group' => 'dashboard'],
        ['slug' => 'dashboard.employee',     'name' => 'Employee Dashboard',     'group' => 'dashboard'],
        // Attendance
        ['slug' => 'attendance.view_all',    'name' => 'View All Attendance',    'group' => 'attendance'],
        ['slug' => 'attendance.view_own',    'name' => 'View Own Attendance',    'group' => 'attendance'],
        ['slug' => 'attendance.check_in',    'name' => 'Check In',               'group' => 'attendance'],
        ['slug' => 'attendance.check_out',   'name' => 'Check Out',              'group' => 'attendance'],
        ['slug' => 'attendance.edit',        'name' => 'Edit Attendance',        'group' => 'attendance'],
        // Customer Visits
        ['slug' => 'visits.view',            'name' => 'View Visits',            'group' => 'visits'],
        ['slug' => 'visits.create',          'name' => 'Add Visit',              'group' => 'visits'],
        ['slug' => 'visits.update',          'name' => 'Edit Visit',             'group' => 'visits'],
        ['slug' => 'visits.manage',          'name' => 'Manage Visits',          'group' => 'visits'],
        // Reports
        ['slug' => 'reports.view_own',       'name' => 'View Own Reports',       'group' => 'reports'],
        ['slug' => 'reports.view_all',       'name' => 'View All Reports',       'group' => 'reports'],
        ['slug' => 'reports.create',         'name' => 'Submit Report',          'group' => 'reports'],
        ['slug' => 'reports.export',         'name' => 'Export Reports',         'group' => 'reports'],
        // GPS / Route Map
        ['slug' => 'gps.view',              'name' => 'View GPS Tracking',      'group' => 'gps'],
        ['slug' => 'gps.live',              'name' => 'Live Locations',         'group' => 'gps'],
        ['slug' => 'gps.history',           'name' => 'Route History',          'group' => 'gps'],
        ['slug' => 'gps.track',             'name' => 'Track Own Location',     'group' => 'gps'],
        // Permission Requests
        ['slug' => 'requests.view_all',      'name' => 'View All Requests',      'group' => 'requests'],
        ['slug' => 'requests.view_own',      'name' => 'View Own Requests',      'group' => 'requests'],
        ['slug' => 'requests.create',        'name' => 'Submit Request',         'group' => 'requests'],
        ['slug' => 'requests.approve',       'name' => 'Approve / Reject',       'group' => 'requests'],
        // Profile
        ['slug' => 'profile.update_own',     'name' => 'Update Own Profile',     'group' => 'profile'],
        ['slug' => 'profile.update_all',     'name' => 'Update All Profiles',    'group' => 'profile'],
        // Notifications
        ['slug' => 'notifications.view',     'name' => 'View Notifications',     'group' => 'notifications'],
        ['slug' => 'notifications.manage',   'name' => 'Manage Notifications',   'group' => 'notifications'],
        // Employees
        ['slug' => 'employees.view',         'name' => 'View Employees',         'group' => 'employees'],
        ['slug' => 'employees.create',       'name' => 'Add Employee',           'group' => 'employees'],
        ['slug' => 'employees.update',       'name' => 'Edit Employee',          'group' => 'employees'],
        ['slug' => 'employees.delete',       'name' => 'Delete Employee',        'group' => 'employees'],
        // Departments
        ['slug' => 'departments.view',       'name' => 'View Departments',       'group' => 'departments'],
        ['slug' => 'departments.manage',     'name' => 'Manage Departments',     'group' => 'departments'],
        // Positions
        ['slug' => 'positions.view',         'name' => 'View Positions',         'group' => 'positions'],
        ['slug' => 'positions.manage',       'name' => 'Manage Positions',       'group' => 'positions'],
        // Outdoor Sales
        ['slug' => 'sales.view',             'name' => 'View Sales',             'group' => 'sales'],
        ['slug' => 'sales.manage',           'name' => 'Manage Sales',           'group' => 'sales'],
        // Roles & Permissions
        ['slug' => 'roles.manage',           'name' => 'Manage Roles',           'group' => 'roles'],
        ['slug' => 'permissions.manage',     'name' => 'Manage Permissions',     'group' => 'permissions'],
        // Settings
        ['slug' => 'settings.view',          'name' => 'View Settings',          'group' => 'settings'],
        ['slug' => 'settings.security',      'name' => 'Security Settings',      'group' => 'settings'],
        ['slug' => 'settings.api',           'name' => 'API Keys',               'group' => 'settings'],
        ['slug' => 'settings.manage',        'name' => 'Manage Settings',        'group' => 'settings'],
        ['slug' => 'settings.schedules',     'name' => 'Manage Schedules',       'group' => 'settings'],
    ];

    private array $rolePermissions = [
        'admin' => [
            'dashboard.admin',
            'attendance.view_all', 'attendance.edit',
            'employees.view', 'employees.create', 'employees.update', 'employees.delete',
            'departments.view', 'departments.manage',
            'positions.view', 'positions.manage',
            'visits.view', 'visits.manage',
            'reports.view_all', 'reports.export',
            'gps.view', 'gps.live',
            'requests.view_all', 'requests.create', 'requests.approve',
            'notifications.manage',
            'profile.update_own', 'profile.update_all',
            'settings.view', 'settings.manage', 'settings.security',
            'roles.manage', 'permissions.manage',
        ],
        'hr_manager' => [
            'dashboard.admin',
            'attendance.view_all', 'attendance.edit',
            'employees.view', 'employees.create', 'employees.update',
            'departments.view', 'departments.manage',
            'positions.view', 'positions.manage',
            'reports.view_all',
            'requests.view_all', 'requests.create', 'requests.approve',
            'profile.update_own', 'profile.update_all',
        ],
        'sales_manager' => [
            'dashboard.admin',
            'sales.view', 'sales.manage',
            'visits.view', 'visits.manage',
            'gps.view', 'gps.live', 'gps.history',
            'reports.view_all', 'reports.export',
            'requests.view_all', 'requests.create', 'requests.approve',
            'profile.update_own',
        ],
        'accountant' => [
            'dashboard.admin',
            'attendance.view_all',
            'reports.view_all', 'reports.export',
            'profile.update_own',
        ],
        'outdoor_sales' => [
            'dashboard.employee',
            'attendance.view_own', 'attendance.check_in', 'attendance.check_out',
            'gps.view', 'gps.track',
            'visits.view', 'visits.create',
            'reports.view_own', 'reports.create',
            'requests.view_own', 'requests.create',
            'notifications.view',
            'profile.update_own',
        ],
        'office_staff' => [
            'dashboard.employee',
            'attendance.view_own', 'attendance.check_in', 'attendance.check_out',
            'requests.view_own', 'requests.create',
            'notifications.view',
            'profile.update_own',
        ],
        'warehouse_staff' => [
            'dashboard.employee',
            'attendance.view_own', 'attendance.check_in', 'attendance.check_out',
            'requests.view_own', 'requests.create',
            'notifications.view',
            'profile.update_own',
        ],
        'driver' => [
            'dashboard.employee',
            'attendance.view_own', 'attendance.check_in', 'attendance.check_out',
            'gps.view', 'gps.track', 'gps.history',
            'requests.view_own', 'requests.create',
            'notifications.view',
            'profile.update_own',
        ],
    ];

    public function up(): void
    {
        // 1. Clear all old role-permission assignments
        DB::table('permission_role')->delete();

        // 2. Clear all old permissions
        DB::table('permissions')->delete();

        // 3. Insert new dot-notation permissions
        $now = now();
        foreach ($this->permissions as $permission) {
            DB::table('permissions')->insert([
                'slug'       => $permission['slug'],
                'name'       => $permission['name'],
                'group'      => $permission['group'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 4. Re-assign permissions to roles
        foreach ($this->rolePermissions as $roleSlug => $permissionSlugs) {
            $roleId = DB::table('roles')->where('slug', $roleSlug)->value('id');
            if (! $roleId) {
                continue;
            }

            $permissionIds = DB::table('permissions')
                ->whereIn('slug', $permissionSlugs)
                ->pluck('id');

            foreach ($permissionIds as $permissionId) {
                DB::table('permission_role')->insert([
                    'role_id'       => $roleId,
                    'permission_id' => $permissionId,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('permission_role')->delete();
        DB::table('permissions')->delete();
    }
};
