<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BonusRule extends Model
{
    protected $fillable = [
        'rule_name',
        'bonus_type',
        'condition_type',
        'condition_value',
        'bonus_amount',
        'frequency',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'condition_value' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'boolean',
    ];

    public function employeeBonuses()
    {
        return $this->hasMany(EmployeeBonus::class);
    }
}
