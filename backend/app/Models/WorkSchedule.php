<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSchedule extends Model
{
    protected $fillable = [
        'schedule_name',
        'monday_start', 'monday_end',
        'tuesday_start', 'tuesday_end',
        'wednesday_start', 'wednesday_end',
        'thursday_start', 'thursday_end',
        'friday_start', 'friday_end',
        'saturday_start', 'saturday_end',
        'sunday_start', 'sunday_end',
        'break_time_minutes', 'is_default',
    ];

    protected $casts = [
        'is_default'          => 'boolean',
        'break_time_minutes'  => 'integer',
    ];

    public function employeeSchedules()
    {
        return $this->hasMany(EmployeeSchedule::class, 'schedule_id');
    }
}
