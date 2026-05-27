<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionRequest extends Model
{
    protected $fillable = [
        'employee_id',
        'replacement_employee_id',
        'request_code',
        'type',
        'request_date',
        'request_date_end',
        'request_time',
        'start_time',
        'end_time',
        'total_hours',
        'total_days',
        'day_part',
        'reason',
        'duration_type',
        'note',
        'attachment_path',
        'attachment_name',
        'attachment_mime',
        'status',
        'is_emergency',
        'gps_location',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'request_date' => 'date',
        'request_date_end' => 'date',
        'total_hours' => 'decimal:2',
        'total_days' => 'integer',
        'is_emergency' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function replacementEmployee()
    {
        return $this->belongsTo(Employee::class, 'replacement_employee_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
