<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeductionRule extends Model
{
    protected $fillable = [
        'rule_name',
        'deduction_type',
        'threshold_minutes',
        'amount',
        'amount_type',
        'status',
    ];

    protected $casts = [
        'threshold_minutes' => 'integer',
        'amount' => 'float',
        'status' => 'boolean',
    ];
}
