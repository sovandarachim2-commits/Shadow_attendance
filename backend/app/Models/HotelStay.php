<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelStay extends Model
{
    protected $fillable = [
        'employee_id',
        'check_in_km',
        'check_out_km',
        'total_km',
        'check_in_address',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_address',
        'check_out_latitude',
        'check_out_longitude',
        'check_in_at',
        'check_out_at',
        'check_in_photo_path',
        'check_out_photo_path',
        'check_in_notes',
        'check_out_notes',
        'status',
    ];

    protected $casts = [
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
