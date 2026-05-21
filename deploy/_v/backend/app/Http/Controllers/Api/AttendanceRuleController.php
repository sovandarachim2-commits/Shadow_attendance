<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRule;
use Illuminate\Http\Request;

class AttendanceRuleController extends Controller
{
    public function index()
    {
        return AttendanceRule::firstOrCreate([]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'office_name'               => ['nullable', 'string', 'max:200'],
            'office_latitude'           => ['nullable', 'numeric', 'between:-90,90'],
            'office_longitude'          => ['nullable', 'numeric', 'between:-180,180'],
            'allowed_radius'            => ['nullable', 'integer', 'min:10', 'max:10000'],
            'gps_verification'          => ['nullable', 'boolean'],
            'work_start_time'           => ['nullable', 'date_format:H:i,H:i:s'],
            'work_end_time'             => ['nullable', 'date_format:H:i,H:i:s'],
            'earliest_checkin_time'     => ['nullable', 'date_format:H:i,H:i:s'],
            'allow_early_checkin'       => ['nullable', 'boolean'],
            'minimum_work_hours'        => ['nullable', 'numeric', 'min:0', 'max:24'],
            'late_grace_minutes'        => ['nullable', 'integer', 'min:0', 'max:120'],
            'auto_mark_late'            => ['nullable', 'boolean'],
            'notify_admin_late'         => ['nullable', 'boolean'],
            'allow_outdoor_checkin'     => ['nullable', 'boolean'],
            'require_gps'               => ['nullable', 'boolean'],
            'require_customer_photo'    => ['nullable', 'boolean'],
            'require_customer_location' => ['nullable', 'boolean'],
            'require_selfie'            => ['nullable', 'boolean'],
            'save_selfie'               => ['nullable', 'boolean'],
            'face_verification'         => ['nullable', 'boolean'],
            'enable_qr'                 => ['nullable', 'boolean'],
            'qr_expiration_minutes'     => ['nullable', 'integer', 'min:1', 'max:60'],
            'dynamic_qr_rotation'       => ['nullable', 'boolean'],
            'auto_missing_checkout'     => ['nullable', 'boolean'],
            'auto_telegram_alerts'      => ['nullable', 'boolean'],
            'auto_daily_summary'        => ['nullable', 'boolean'],
        ]);

        $rule = AttendanceRule::firstOrCreate([]);
        $rule->update($data);

        return $rule->fresh();
    }
}
