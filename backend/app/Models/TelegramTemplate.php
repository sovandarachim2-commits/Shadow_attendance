<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramTemplate extends Model
{
    protected $fillable = [
        'type',
        'message_template',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
