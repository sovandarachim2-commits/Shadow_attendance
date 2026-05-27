<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            $table->time('missing_checkout_detection_time')->default('18:00:00')->after('auto_daily_summary');
            $table->time('daily_summary_time')->default('18:30:00')->after('missing_checkout_detection_time');
        });
    }

    public function down(): void
    {
        Schema::table('attendance_rules', function (Blueprint $table) {
            $table->dropColumn(['missing_checkout_detection_time', 'daily_summary_time']);
        });
    }
};
