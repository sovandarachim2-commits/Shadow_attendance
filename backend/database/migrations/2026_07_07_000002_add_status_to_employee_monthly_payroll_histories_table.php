<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_monthly_payroll_histories', function (Blueprint $table) {
            if (! Schema::hasColumn('employee_monthly_payroll_histories', 'status')) {
                $table->enum('status', ['pending', 'paid'])->default('pending')->after('net_salary');
            }
        });
    }

    public function down(): void
    {
        Schema::table('employee_monthly_payroll_histories', function (Blueprint $table) {
            if (Schema::hasColumn('employee_monthly_payroll_histories', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
