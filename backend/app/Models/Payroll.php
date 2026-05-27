<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payroll extends Model
{
    protected $fillable = [
        'month',
        'status',
        'total_base_salary',
        'total_bonus',
        'total_deductions',
        'total_overtime',
        'total_commission',
        'total_net_salary',
        'generated_by',
        'approved_by',
        'paid_by',
        'generated_at',
        'approved_at',
        'paid_at',
    ];

    protected $casts = [
        'month' => 'date',
        'total_base_salary' => 'float',
        'total_bonus' => 'float',
        'total_deductions' => 'float',
        'total_overtime' => 'float',
        'total_commission' => 'float',
        'total_net_salary' => 'float',
        'generated_at' => 'datetime',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
