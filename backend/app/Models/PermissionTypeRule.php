<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionTypeRule extends Model
{
    protected $fillable = [
        'permission_type_id',
        'employee_id',
        'work_schedule_id',
        'allowed_times',
        'limit_type',
        'duration_control',
        'max_hours',
        'deduction_amount',
        'is_active',
    ];

    protected $casts = [
        'allowed_times' => 'integer',
        'max_hours' => 'decimal:2',
        'deduction_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function permissionType()
    {
        return $this->belongsTo(PermissionType::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function workSchedule()
    {
        return $this->belongsTo(WorkSchedule::class);
    }
}
