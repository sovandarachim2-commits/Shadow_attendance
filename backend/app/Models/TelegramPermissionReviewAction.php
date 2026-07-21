<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramPermissionReviewAction extends Model
{
    protected $fillable = [
        'permission_request_id',
        'user_id',
        'telegram_chat_id',
        'action',
    ];

    public function permissionRequest()
    {
        return $this->belongsTo(PermissionRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
