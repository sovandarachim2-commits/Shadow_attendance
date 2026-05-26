<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\WorkSchedule;

class LateDeductionRule extends Model
{
    protected $fillable = [
        'rule_name', 'grace_minutes', 'from_minutes', 'to_minutes',
        'deduction_type', 'deduction_amount', 'status',
        'telegram_chat_id', 'telegram_topic_id',
    ];

    protected $casts = [
        'grace_minutes'      => 'integer',
        'from_minutes'       => 'integer',
        'to_minutes'         => 'integer',
        'deduction_amount'   => 'decimal:2',
        'status'             => 'boolean',
        'telegram_topic_id'  => 'integer',
    ];

    public function schedules()
    {
        return $this->belongsToMany(WorkSchedule::class, 'late_deduction_rule_work_schedule');
    }
}
