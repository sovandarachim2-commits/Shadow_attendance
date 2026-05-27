<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionType extends Model
{
    protected $fillable = [
        'name',
        'allowed_times',
        'limit_type',
        'deduction_amount',
        'color',
        'description',
    ];

    protected $casts = [
        'allowed_times'    => 'integer',
        'deduction_amount' => 'decimal:2',
    ];
}
