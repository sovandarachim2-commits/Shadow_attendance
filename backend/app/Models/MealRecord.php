<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealRecord extends Model
{
    protected $fillable = [
        'employee_id',
        'meal_type',
        'address',
        'latitude',
        'longitude',
        'recorded_at',
        'notes',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
