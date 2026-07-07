<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeMonthlyPayrollHistory extends Model
{
    protected $fillable = [
        'employee_id',
        'month',
        'base_salary',
        'allowances',
        'overtime',
        'commission',
        'bonus',
        'deductions',
        'tax',
        'net_salary',
        'status',
        'report_snapshot',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'month' => 'date',
        'base_salary' => 'encrypted',
        'allowances' => 'encrypted',
        'overtime' => 'encrypted',
        'commission' => 'encrypted',
        'bonus' => 'encrypted',
        'deductions' => 'encrypted',
        'tax' => 'encrypted',
        'net_salary' => 'encrypted',
        'report_snapshot' => 'array',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
