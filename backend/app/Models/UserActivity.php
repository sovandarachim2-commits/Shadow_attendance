<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

class UserActivity extends Model
{
    use HasFactory;

    /**
     * Audit records only have a created_at timestamp (append-only).
     */
    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
        'record_type',
        'record_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'status',
        'created_at',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Enforce append-only integrity at the model level.
     */
    protected static function booted(): void
    {
        static::updating(function () {
            throw new RuntimeException('User activity records are append-only and cannot be updated.');
        });

        static::deleting(function () {
            throw new RuntimeException('User activity records are immutable and cannot be deleted.');
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

