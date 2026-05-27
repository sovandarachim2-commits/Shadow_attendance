<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $permissions = [
        ['slug' => 'payroll.view_all', 'name' => 'View All Payroll', 'group' => 'payroll'],
        ['slug' => 'payroll.view_own', 'name' => 'View Own Payslips', 'group' => 'payroll'],
        ['slug' => 'payroll.create', 'name' => 'Generate Payroll', 'group' => 'payroll'],
        ['slug' => 'payroll.update', 'name' => 'Update Payroll', 'group' => 'payroll'],
        ['slug' => 'payroll.approve', 'name' => 'Approve Payroll', 'group' => 'payroll'],
        ['slug' => 'payroll.pay', 'name' => 'Mark Payroll Paid', 'group' => 'payroll'],
        ['slug' => 'payroll.export', 'name' => 'Export Payroll', 'group' => 'payroll'],
    ];

    public function up(): void
    {
        Schema::create('salary_setups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->unique()->constrained('employees')->cascadeOnDelete();
            $table->enum('salary_type', ['monthly', 'daily', 'commission_only'])->default('monthly');
            $table->decimal('base_salary', 12, 2)->default(0);
            $table->unsignedTinyInteger('payroll_day')->default(28);
            $table->decimal('overtime_rate', 10, 2)->default(0);
            $table->decimal('commission_percent', 5, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('deduction_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_name');
            $table->enum('deduction_type', ['late', 'absent', 'missing_checkout', 'manual_penalty', 'salary_advance']);
            $table->unsignedInteger('threshold_minutes')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->enum('amount_type', ['fixed', 'daily_salary'])->default('fixed');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('salary_advances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->decimal('remaining_amount', 12, 2)->default(0);
            $table->date('request_date');
            $table->date('deduct_month')->nullable();
            $table->text('reason')->nullable();
            $table->enum('status', ['pending', 'approved', 'deducted', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->date('month');
            $table->enum('status', ['draft', 'pending', 'approved', 'paid', 'locked'])->default('draft');
            $table->decimal('total_base_salary', 14, 2)->default(0);
            $table->decimal('total_bonus', 14, 2)->default(0);
            $table->decimal('total_deductions', 14, 2)->default(0);
            $table->decimal('total_overtime', 14, 2)->default(0);
            $table->decimal('total_commission', 14, 2)->default(0);
            $table->decimal('total_net_salary', 14, 2)->default(0);
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('paid_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->unique('month');
        });

        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained('payrolls')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('salary_setup_id')->nullable()->constrained('salary_setups')->nullOnDelete();
            $table->enum('salary_type', ['monthly', 'daily', 'commission_only'])->default('monthly');
            $table->decimal('base_salary', 12, 2)->default(0);
            $table->unsignedInteger('present_days')->default(0);
            $table->unsignedInteger('late_days')->default(0);
            $table->unsignedInteger('absent_days')->default(0);
            $table->unsignedInteger('half_days')->default(0);
            $table->unsignedInteger('missing_checkout_days')->default(0);
            $table->decimal('overtime_hours', 8, 2)->default(0);
            $table->decimal('sales_amount', 14, 2)->default(0);
            $table->decimal('bonus_amount', 12, 2)->default(0);
            $table->decimal('deduction_amount', 12, 2)->default(0);
            $table->decimal('advance_amount', 12, 2)->default(0);
            $table->decimal('overtime_amount', 12, 2)->default(0);
            $table->decimal('commission_amount', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);
            $table->json('bonus_breakdown')->nullable();
            $table->json('deduction_breakdown')->nullable();
            $table->json('commission_breakdown')->nullable();
            $table->json('attendance_snapshot')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'paid'])->default('draft');
            $table->timestamps();
            $table->unique(['payroll_id', 'employee_id']);
        });

        Schema::create('payroll_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->nullable()->constrained('payrolls')->cascadeOnDelete();
            $table->foreignId('payroll_item_id')->nullable()->constrained('payroll_items')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        foreach ($this->permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']],
                [
                    'name' => $permission['name'],
                    'group' => $permission['group'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ],
            );
        }

        $adminSlugs = ['super_admin', 'admin', 'hr_manager', 'accountant'];
        $employeeSlugs = ['outdoor_sales', 'office_staff', 'warehouse_staff', 'driver'];
        $adminPermissions = DB::table('permissions')->whereIn('slug', array_column($this->permissions, 'slug'))->pluck('id');
        $ownPermission = DB::table('permissions')->where('slug', 'payroll.view_own')->value('id');

        foreach (DB::table('roles')->whereIn('slug', $adminSlugs)->pluck('id') as $roleId) {
            foreach ($adminPermissions as $permissionId) {
                DB::table('permission_role')->updateOrInsert(
                    ['role_id' => $roleId, 'permission_id' => $permissionId],
                    ['updated_at' => now(), 'created_at' => now()],
                );
            }
        }

        if ($ownPermission) {
            foreach (DB::table('roles')->whereIn('slug', $employeeSlugs)->pluck('id') as $roleId) {
                DB::table('permission_role')->updateOrInsert(
                    ['role_id' => $roleId, 'permission_id' => $ownPermission],
                    ['updated_at' => now(), 'created_at' => now()],
                );
            }
        }
    }

    public function down(): void
    {
        $slugs = array_column($this->permissions, 'slug');
        $permissionIds = DB::table('permissions')->whereIn('slug', $slugs)->pluck('id');
        DB::table('permission_role')->whereIn('permission_id', $permissionIds)->delete();
        DB::table('permissions')->whereIn('slug', $slugs)->delete();

        Schema::dropIfExists('payroll_logs');
        Schema::dropIfExists('payroll_items');
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('salary_advances');
        Schema::dropIfExists('deduction_rules');
        Schema::dropIfExists('salary_setups');
    }
};
