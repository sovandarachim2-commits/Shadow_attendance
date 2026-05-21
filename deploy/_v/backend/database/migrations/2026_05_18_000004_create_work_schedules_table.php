<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('schedule_name');
            $table->time('monday_start')->nullable();
            $table->time('monday_end')->nullable();
            $table->time('tuesday_start')->nullable();
            $table->time('tuesday_end')->nullable();
            $table->time('wednesday_start')->nullable();
            $table->time('wednesday_end')->nullable();
            $table->time('thursday_start')->nullable();
            $table->time('thursday_end')->nullable();
            $table->time('friday_start')->nullable();
            $table->time('friday_end')->nullable();
            $table->time('saturday_start')->nullable();
            $table->time('saturday_end')->nullable();
            $table->time('sunday_start')->nullable();
            $table->time('sunday_end')->nullable();
            $table->integer('break_time_minutes')->default(60);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('employee_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained('work_schedules')->cascadeOnDelete();
            $table->date('effective_date');
            $table->timestamps();
        });

        // Seed default schedule (Mon–Fri)
        DB::table('work_schedules')->insert([
            'schedule_name'     => 'Standard (Mon–Fri)',
            'monday_start'      => '08:00:00',
            'monday_end'        => '17:00:00',
            'tuesday_start'     => '08:00:00',
            'tuesday_end'       => '17:00:00',
            'wednesday_start'   => '08:00:00',
            'wednesday_end'     => '17:00:00',
            'thursday_start'    => '08:00:00',
            'thursday_end'      => '17:00:00',
            'friday_start'      => '08:00:00',
            'friday_end'        => '17:00:00',
            'saturday_start'    => null,
            'saturday_end'      => null,
            'sunday_start'      => null,
            'sunday_end'        => null,
            'break_time_minutes'=> 60,
            'is_default'        => true,
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_schedules');
        Schema::dropIfExists('work_schedules');
    }
};
