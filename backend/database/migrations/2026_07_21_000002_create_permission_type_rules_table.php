<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_type_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_type_id')->constrained('permission_types')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->cascadeOnDelete();
            $table->foreignId('work_schedule_id')->nullable()->constrained('work_schedules')->cascadeOnDelete();
            $table->unsignedInteger('allowed_times')->default(1);
            $table->enum('limit_type', ['per_day', 'per_month', 'per_year'])->default('per_month');
            $table->string('duration_control', 20)->default('any');
            $table->decimal('max_hours', 5, 2)->nullable();
            $table->decimal('deduction_amount', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['permission_type_id', 'employee_id'], 'permission_type_employee_rule_unique');
            $table->unique(['permission_type_id', 'work_schedule_id'], 'permission_type_schedule_rule_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_type_rules');
    }
};
