<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Path extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_zone_id',
        'end_zone_id',
        'waypoints',
        'is_safe',
    ];

    protected $casts = [
        'waypoints' => 'array',
        'is_safe' => 'boolean',
    ];

    // ✅ علاقات
    public function startZone()
    {
        return $this->belongsTo(Zone::class, 'start_zone_id');
    }

    public function endZone()
    {
        return $this->belongsTo(Zone::class, 'end_zone_id');
    }
}
