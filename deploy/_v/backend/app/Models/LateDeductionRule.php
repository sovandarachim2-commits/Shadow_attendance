<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LateDeductionRule extends Model
{
    protected $fillable = [
        'rule_name', 'grace_minutes', 'from_minutes', 'to_minutes',
        'deduction_type', 'deduction_amount', 'status',
    ];

    protected $casts = [
        'grace_minutes'    => 'integer',
        'from_minutes'     => 'integer',
        'to_minutes'       => 'integer',
        'deduction_amount' => 'decimal:2',
        'status'           => 'boolean',
    ];
}
