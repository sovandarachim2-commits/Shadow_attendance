<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_rules', function (Blueprint $table) {
            $table->id();
            // Office GPS
            $table->string('office_name')->default('Main Office');
            $table->decimal('office_latitude', 10, 7)->nullable();
            $table->decimal('office_longitude', 10, 7)->nullable();
            $table->integer('allowed_radius')->default(100);
            $table->boolean('gps_verification')->default(true);
            // Check In Settings
            $table->time('work_start_time')->default('08:00:00');
            $table->time('work_end_time')->default('17:00:00');
            $table->time('earliest_checkin_time')->default('07:00:00');
            $table->boolean('allow_early_checkin')->default(true);
            $table->decimal('minimum_work_hours', 4, 2)->default(8.0);
            // Late Rules
            $table->integer('late_grace_minutes')->default(15);
            $table->boolean('auto_mark_late')->default(true);
            $table->boolean('notify_admin_late')->default(false);
            // Outdoor Attendance
            $table->boolean('allow_outdoor_checkin')->default(true);
            $table->boolean('require_gps')->default(true);
            $table->boolean('require_customer_photo')->default(false);
            $table->boolean('require_customer_location')->default(false);
            // Selfie Verification
            $table->boolean('require_selfie')->default(false);
            $table->boolean('save_selfie')->default(true);
            $table->boolean('face_verification')->default(false);
            // QR Code
            $table->boolean('enable_qr')->default(false);
            $table->integer('qr_expiration_minutes')->default(5);
            $table->boolean('dynamic_qr_rotation')->default(false);
            // Automation
            $table->boolean('auto_missing_checkout')->default(true);
            $table->boolean('auto_telegram_alerts')->default(false);
            $table->boolean('auto_daily_summary')->default(false);
            $table->time('missing_checkout_detection_time')->default('18:00:00');
            $table->time('daily_summary_time')->default('18:30:00');
            $table->timestamps();
        });

        // Seed one default record
        DB::table('attendance_rules')->insert([
            'office_name'              => 'Main Office',
            'allowed_radius'           => 100,
            'gps_verification'         => true,
            'work_start_time'          => '08:00:00',
            'work_end_time'            => '17:00:00',
            'earliest_checkin_time'    => '07:00:00',
            'allow_early_checkin'      => true,
            'minimum_work_hours'       => 8.0,
            'late_grace_minutes'       => 15,
            'auto_mark_late'           => true,
            'notify_admin_late'        => false,
            'allow_outdoor_checkin'    => true,
            'require_gps'              => true,
            'require_customer_photo'   => false,
            'require_customer_location'=> false,
            'require_selfie'           => false,
            'save_selfie'              => true,
            'face_verification'        => false,
            'enable_qr'                => false,
            'qr_expiration_minutes'    => 5,
            'dynamic_qr_rotation'      => false,
            'auto_missing_checkout'    => true,
            'auto_telegram_alerts'     => false,
            'auto_daily_summary'       => false,
            'missing_checkout_detection_time' => '18:00:00',
            'daily_summary_time'       => '18:30:00',
            'created_at'               => now(),
            'updated_at'               => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_rules');
    }
};
