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
        'return_date',
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
        'telegram_chat_id',
        'telegram_message_thread_id',
        'telegram_message_id',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'request_date' => 'date',
        'request_date_end' => 'date',
        'return_date' => 'date',
        'total_hours' => 'decimal:2',
        'total_days' => 'integer',
        'is_emergency' => 'boolean',
        'telegram_message_thread_id' => 'integer',
        'telegram_message_id' => 'integer',
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
