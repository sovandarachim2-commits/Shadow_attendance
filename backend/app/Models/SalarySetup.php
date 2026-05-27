<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalarySetup extends Model
{
    protected $fillable = [
        'employee_id',
        'salary_type',
        'base_salary',
        'payroll_day',
        'overtime_rate',
        'commission_percent',
        'status',
        'notes',
    ];

    protected $casts = [
        'base_salary' => 'float',
        'payroll_day' => 'integer',
        'overtime_rate' => 'float',
        'commission_percent' => 'float',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
