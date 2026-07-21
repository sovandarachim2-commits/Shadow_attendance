<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            if (! Schema::hasColumn('attendance_rules', 'missing_checkout_detection_time')) {
                $table->time('missing_checkout_detection_time')->default('18:00:00')->after('auto_daily_summary');
            }

            if (! Schema::hasColumn('attendance_rules', 'daily_summary_time')) {
                $table->time('daily_summary_time')->default('18:30:00')->after('missing_checkout_detection_time');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            $columns = array_values(array_filter([
                Schema::hasColumn('attendance_rules', 'daily_summary_time') ? 'daily_summary_time' : null,
                Schema::hasColumn('attendance_rules', 'missing_checkout_detection_time') ? 'missing_checkout_detection_time' : null,
            ]));

            if ($columns) {
                $table->dropColumn($columns);
            }
        });
    }
};
