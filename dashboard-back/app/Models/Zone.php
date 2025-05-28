<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $table = 'zones';

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'status',
        'reason',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'status' => 'string',
    ];


public function species()
{
    return $this->belongsToMany(Species::class, 'species_zone')
                ->withPivot('quantity')
                ->withTimestamps();
}

        public function startPaths()
    {
        return $this->hasMany(Path::class, 'start_zone_id');
    }

    
    public function endPaths()
    {
        return $this->hasMany(Path::class, 'end_zone_id');
    }
}
