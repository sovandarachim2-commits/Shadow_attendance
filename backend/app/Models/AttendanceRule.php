<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceRule extends Model
{
    protected $fillable = [
        'office_name', 'office_latitude', 'office_longitude', 'allowed_radius', 'gps_verification',
        'work_start_time', 'work_end_time', 'earliest_checkin_time', 'allow_early_checkin', 'minimum_work_hours',
        'late_grace_minutes', 'auto_mark_late', 'notify_admin_late',
        'allow_outdoor_checkin', 'require_gps', 'require_customer_photo', 'require_customer_location',
        'require_selfie', 'save_selfie', 'face_verification',
        'enable_qr', 'qr_expiration_minutes', 'dynamic_qr_rotation',
        'auto_missing_checkout', 'auto_telegram_alerts', 'auto_daily_summary',
    ];

    protected $casts = [
        'office_latitude'           => 'float',
        'office_longitude'          => 'float',
        'allowed_radius'            => 'integer',
        'gps_verification'          => 'boolean',
        'allow_early_checkin'       => 'boolean',
        'minimum_work_hours'        => 'float',
        'late_grace_minutes'        => 'integer',
        'auto_mark_late'            => 'boolean',
        'notify_admin_late'         => 'boolean',
        'allow_outdoor_checkin'     => 'boolean',
        'require_gps'               => 'boolean',
        'require_customer_photo'    => 'boolean',
        'require_customer_location' => 'boolean',
        'require_selfie'            => 'boolean',
        'save_selfie'               => 'boolean',
        'face_verification'         => 'boolean',
        'enable_qr'                 => 'boolean',
        'qr_expiration_minutes'     => 'integer',
        'dynamic_qr_rotation'       => 'boolean',
        'auto_missing_checkout'     => 'boolean',
        'auto_telegram_alerts'      => 'boolean',
        'auto_daily_summary'        => 'boolean',
    ];
}
