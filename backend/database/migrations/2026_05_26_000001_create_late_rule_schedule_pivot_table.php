<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('late_deduction_rule_work_schedule', function (Blueprint $table) {
            $table->foreignId('late_deduction_rule_id')
                ->constrained('late_deduction_rules')
                ->cascadeOnDelete();
            $table->foreignId('work_schedule_id')
                ->constrained('work_schedules')
                ->cascadeOnDelete();
            $table->primary(['late_deduction_rule_id', 'work_schedule_id']);
        });

        // Migrate existing single schedule_id values into the pivot table
        DB::table('late_deduction_rules')
            ->whereNotNull('schedule_id')
            ->get(['id', 'schedule_id'])
            ->each(function ($rule) {
                DB::table('late_deduction_rule_work_schedule')->insert([
                    'late_deduction_rule_id' => $rule->id,
                    'work_schedule_id'       => $rule->schedule_id,
                ]);
            });

        Schema::table('late_deduction_rules', function (Blueprint $table) {
            $table->dropForeign(['schedule_id']);
            $table->dropColumn('schedule_id');
        });
    }

    public function down(): void
    {
        Schema::table('late_deduction_rules', function (Blueprint $table) {
            $table->foreignId('schedule_id')
                ->nullable()
                ->constrained('work_schedules')
                ->nullOnDelete();
        });

        // Restore first schedule per rule from pivot
        DB::table('late_deduction_rule_work_schedule')
            ->get()
            ->each(function ($pivot) {
                DB::table('late_deduction_rules')
                    ->where('id', $pivot->late_deduction_rule_id)
                    ->whereNull('schedule_id')
                    ->update(['schedule_id' => $pivot->work_schedule_id]);
            });

        Schema::dropIfExists('late_deduction_rule_work_schedule');
    }
};
