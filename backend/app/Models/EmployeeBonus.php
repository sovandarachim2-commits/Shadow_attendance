<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeBonus extends Model
{
    protected $fillable = [
        'employee_id',
        'bonus_rule_id',
        'month',
        'bonus_amount',
        'bonus_type',
        'reason',
        'status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'month' => 'date',
        'bonus_amount' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function bonusRule()
    {
        return $this->belongsTo(BonusRule::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
