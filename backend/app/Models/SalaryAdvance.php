<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryAdvance extends Model
{
    protected $fillable = [
        'employee_id',
        'amount',
        'remaining_amount',
        'request_date',
        'deduct_month',
        'reason',
        'status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'remaining_amount' => 'float',
        'request_date' => 'date',
        'deduct_month' => 'date',
        'approved_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
