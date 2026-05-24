<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramDestination extends Model
{
    protected $fillable = [
        'name',
        'event_key',
        'chat_id',
        'message_thread_id',
        'enabled',
        'send_photo',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'send_photo' => 'boolean',
        'message_thread_id' => 'integer',
    ];
}
