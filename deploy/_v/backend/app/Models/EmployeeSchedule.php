<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeSchedule extends Model
{
    protected $fillable = ['employee_id', 'schedule_id', 'effective_date'];

    protected $casts = ['effective_date' => 'date'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function schedule()
    {
        return $this->belongsTo(WorkSchedule::class, 'schedule_id');
    }
}
