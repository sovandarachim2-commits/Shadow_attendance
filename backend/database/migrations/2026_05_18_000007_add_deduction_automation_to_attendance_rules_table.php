<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            if (!Schema::hasColumn('attendance_rules', 'auto_apply_deduction')) {
                $table->boolean('auto_apply_deduction')->default(false)->after('auto_daily_summary');
            }
            if (!Schema::hasColumn('attendance_rules', 'notify_employee_late')) {
                $table->boolean('notify_employee_late')->default(false)->after('auto_apply_deduction');
            }
            if (!Schema::hasColumn('attendance_rules', 'include_in_payroll')) {
                $table->boolean('include_in_payroll')->default(true)->after('notify_employee_late');
            }
            if (!Schema::hasColumn('attendance_rules', 'auto_mark_half_day')) {
                $table->boolean('auto_mark_half_day')->default(false)->after('include_in_payroll');
            }
            if (!Schema::hasColumn('attendance_rules', 'auto_mark_absent')) {
                $table->boolean('auto_mark_absent')->default(false)->after('auto_mark_half_day');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            $cols = ['auto_apply_deduction', 'notify_employee_late', 'include_in_payroll', 'auto_mark_half_day', 'auto_mark_absent'];
            $table->dropColumn(array_filter($cols, fn ($c) => Schema::hasColumn('attendance_rules', $c)));
        });
    }
};
