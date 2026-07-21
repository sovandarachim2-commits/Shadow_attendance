<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionType extends Model
{
    protected $fillable = [
        'name',
        'allowed_times',
        'limit_type',
        'duration_control',
        'max_hours',
        'deduction_amount',
        'color',
        'description',
        'is_active',
    ];

    protected $casts = [
        'allowed_times'    => 'integer',
        'max_hours'        => 'decimal:2',
        'deduction_amount' => 'decimal:2',
        'is_active'        => 'boolean',
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'permission_type_employee')->withTimestamps();
    }

    public function workSchedules()
    {
        return $this->belongsToMany(WorkSchedule::class, 'permission_type_work_schedule')->withTimestamps();
    }

    public function rules()
    {
        return $this->hasMany(PermissionTypeRule::class);
    }
}
