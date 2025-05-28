<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarineWeatherReport extends Model
{
    use HasFactory;

   protected $fillable = [
    'region',
    'date',
    'temperature',
    'wind_speed',
    'wind_direction',
    'rain_probability',
    'wave_height',
    'wave_danger',
    'latitude',
    'longitude',
];
}

