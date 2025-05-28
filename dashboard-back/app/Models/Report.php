<?php

// app/Models/Report.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'description',
        'latitude',
        'longitude',
        'status'
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}