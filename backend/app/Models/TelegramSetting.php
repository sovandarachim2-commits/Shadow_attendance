<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramSetting extends Model
{
    protected $fillable = [
        'bot_token',
        'chat_id',
        'webhook_url',
        'status',
        'last_notification_sent_at',
    ];

    protected $casts = [
        'last_notification_sent_at' => 'datetime',
    ];
}
