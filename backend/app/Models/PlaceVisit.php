<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaceVisit extends Model
{
    protected $fillable = [
        'employee_id',
        'start_address',
        'start_latitude',
        'start_longitude',
        'started_at',
        'start_photo_path',
        'start_notes',
        'end_address',
        'end_latitude',
        'end_longitude',
        'ended_at',
        'end_photo_path',
        'end_notes',
        'duration_minutes',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
