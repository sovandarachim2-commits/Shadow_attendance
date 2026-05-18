<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LateRule extends Model
{
    protected $fillable = [
        'work_start_time',
        'grace_minutes',
        'auto_mark_late',
        'notify_admin',
        'auto_apply_deduction',
        'include_in_payroll',
        'notify_employee',
        'exclude_on_holidays',
        'preview_check_in',
    ];

    protected $casts = [
        'grace_minutes'        => 'integer',
        'auto_mark_late'       => 'boolean',
        'notify_admin'         => 'boolean',
        'auto_apply_deduction' => 'boolean',
        'include_in_payroll'   => 'boolean',
        'notify_employee'      => 'boolean',
        'exclude_on_holidays'  => 'boolean',
    ];
}
