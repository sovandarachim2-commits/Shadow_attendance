<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_type_employee', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_type_id')->constrained('permission_types')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['permission_type_id', 'employee_id'], 'permission_type_employee_unique');
        });

        Schema::create('permission_type_work_schedule', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_type_id')->constrained('permission_types')->cascadeOnDelete();
            $table->foreignId('work_schedule_id')->constrained('work_schedules')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['permission_type_id', 'work_schedule_id'], 'permission_type_schedule_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_type_work_schedule');
        Schema::dropIfExists('permission_type_employee');
    }
};
