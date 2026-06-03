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
    ];

    protected $casts = [
        'allowed_times'    => 'integer',
        'max_hours'        => 'decimal:2',
        'deduction_amount' => 'decimal:2',
    ];
}
