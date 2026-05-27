<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollLog extends Model
{
    protected $fillable = [
        'payroll_id',
        'payroll_item_id',
        'user_id',
        'action',
        'notes',
    ];
}
