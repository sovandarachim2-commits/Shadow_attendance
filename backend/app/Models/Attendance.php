<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\ImageUploadService;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $appends = ['photo_url'];

    protected $fillable = [
        'employee_id', 'branch_id', 'attendance_date', 'type', 'status', 'check_in_at', 'check_out_at',
        'check_in_latitude', 'check_in_longitude', 'check_in_address',
        'check_out_latitude', 'check_out_longitude', 'check_out_address',
        'check_in_photo_path', 'check_out_photo_path', 'qr_code', 'late_minutes', 'deduction_amount', 'deduction_reason', 'work_minutes',
        'notes', 'offline_sync_uuid', 'synced_at',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
        'synced_at' => 'datetime',
    ];

    /** Public URL for check-in selfie (used by admin edit modal). */
    public function getPhotoUrlAttribute(): ?string
    {
        if (! $this->check_in_photo_path) {
            return null;
        }

        return app(ImageUploadService::class)->url($this->check_in_photo_path);
    }

    public function employee() { return $this->belongsTo(Employee::class); }
    public function branch() { return $this->belongsTo(Branch::class); }
    public function logs() { return $this->hasMany(AttendanceLog::class); }
}
