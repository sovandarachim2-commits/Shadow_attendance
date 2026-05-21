<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('late_rules', function (Blueprint $table) {
            $table->id();
            $table->time('work_start_time')->default('08:00:00');
            $table->unsignedSmallInteger('grace_minutes')->default(15);
            $table->boolean('auto_mark_late')->default(true);
            $table->boolean('notify_admin')->default(true);
            $table->boolean('auto_apply_deduction')->default(true);
            $table->boolean('include_in_payroll')->default(true);
            $table->boolean('notify_employee')->default(false);
            $table->boolean('exclude_on_holidays')->default(false);
            $table->time('preview_check_in')->default('08:35:00');
            $table->timestamps();
        });

        DB::table('late_rules')->insert([
            'work_start_time'       => '08:00:00',
            'grace_minutes'         => 15,
            'auto_mark_late'        => true,
            'notify_admin'          => true,
            'auto_apply_deduction'  => true,
            'include_in_payroll'    => true,
            'notify_employee'       => false,
            'exclude_on_holidays'   => false,
            'preview_check_in'      => '08:35:00',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('late_rules');
    }
};
