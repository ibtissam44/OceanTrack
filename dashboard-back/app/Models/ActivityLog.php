<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'value',
    ];

    public $timestamps = false;

    protected $casts = [
        'date' => 'date',
    ];
}
