<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BonusSetting extends Model
{
    protected $fillable = [
        'auto_calculate_bonus',
        'include_in_payroll',
        'notify_employee',
        'notify_admin',
        'auto_approve_bonus',
        'bonus_expiration',
    ];

    protected $casts = [
        'auto_calculate_bonus' => 'boolean',
        'include_in_payroll' => 'boolean',
        'notify_employee' => 'boolean',
        'notify_admin' => 'boolean',
        'auto_approve_bonus' => 'boolean',
        'bonus_expiration' => 'boolean',
    ];
}
