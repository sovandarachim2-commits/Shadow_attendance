<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            if (! Schema::hasColumn('attendance_rules', 'auto_check_in_reminder')) {
                $table->boolean('auto_check_in_reminder')->default(false)->after('auto_telegram_alerts');
            }

            if (! Schema::hasColumn('attendance_rules', 'check_in_reminder_time')) {
                $table->time('check_in_reminder_time')->default('08:00:00')->after('auto_check_in_reminder');
            }

            if (! Schema::hasColumn('attendance_rules', 'auto_check_out_reminder')) {
                $table->boolean('auto_check_out_reminder')->default(false)->after('check_in_reminder_time');
            }

            if (! Schema::hasColumn('attendance_rules', 'check_out_reminder_time')) {
                $table->time('check_out_reminder_time')->default('17:00:00')->after('auto_check_out_reminder');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            $columns = array_filter([
                Schema::hasColumn('attendance_rules', 'auto_check_in_reminder') ? 'auto_check_in_reminder' : null,
                Schema::hasColumn('attendance_rules', 'check_in_reminder_time') ? 'check_in_reminder_time' : null,
                Schema::hasColumn('attendance_rules', 'auto_check_out_reminder') ? 'auto_check_out_reminder' : null,
                Schema::hasColumn('attendance_rules', 'check_out_reminder_time') ? 'check_out_reminder_time' : null,
            ]);

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
