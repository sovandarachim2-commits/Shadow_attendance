<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('late_deduction_rules', function (Blueprint $table) {
            $table->foreignId('schedule_id')
                ->nullable()
                ->after('status')
                ->constrained('work_schedules')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('late_deduction_rules', function (Blueprint $table) {
            $table->dropForeign(['schedule_id']);
            $table->dropColumn('schedule_id');
        });
    }
};
