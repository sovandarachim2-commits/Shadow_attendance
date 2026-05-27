<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    protected $fillable = [
        'payroll_id',
        'employee_id',
        'salary_setup_id',
        'salary_type',
        'base_salary',
        'present_days',
        'late_days',
        'absent_days',
        'half_days',
        'missing_checkout_days',
        'overtime_hours',
        'sales_amount',
        'bonus_amount',
        'deduction_amount',
        'advance_amount',
        'overtime_amount',
        'commission_amount',
        'net_salary',
        'bonus_breakdown',
        'deduction_breakdown',
        'commission_breakdown',
        'attendance_snapshot',
        'status',
    ];

    protected $casts = [
        'base_salary' => 'float',
        'present_days' => 'integer',
        'late_days' => 'integer',
        'absent_days' => 'integer',
        'half_days' => 'integer',
        'missing_checkout_days' => 'integer',
        'overtime_hours' => 'float',
        'sales_amount' => 'float',
        'bonus_amount' => 'float',
        'deduction_amount' => 'float',
        'advance_amount' => 'float',
        'overtime_amount' => 'float',
        'commission_amount' => 'float',
        'net_salary' => 'float',
        'bonus_breakdown' => 'array',
        'deduction_breakdown' => 'array',
        'commission_breakdown' => 'array',
        'attendance_snapshot' => 'array',
    ];

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(Payroll::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function salarySetup(): BelongsTo
    {
        return $this->belongsTo(SalarySetup::class);
    }
}
