<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelegramLog extends Model
{
    protected $fillable = [
        'employee_id',
        'customer_visit_id',
        'message_type',
        'event_key',
        'telegram_message',
        'selfie_url',
        'store_photo_url',
        'error_message',
        'status',
        'attempts',
        'sent_at',
    ];

    protected $casts = [
        'sent_at'  => 'datetime',
        'attempts' => 'integer',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function customerVisit(): BelongsTo
    {
        return $this->belongsTo(CustomerVisit::class);
    }
}
