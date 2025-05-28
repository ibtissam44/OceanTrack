<?php

// app/Models/Species.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Species extends Model
{
  

protected $fillable = [
    'scientific_name',
    'local_name',
    'image_path',
    'status',
    'biological_rest_start',
    'biological_rest_end',
    'notes',
    'quantity',
    'found_location',
    'latitude',     // ✅
    'longitude',    // ✅
];



public function zones()
{
    return $this->belongsToMany(Zone::class, 'species_zone')
                ->withPivot(['quantity', 'latitude', 'longitude'])
                ->withTimestamps();
}

public function scopeInBiologicalRest($query)
{
    $currentDate = now()->format('Y-m-d');
    return $query->whereDate('biological_rest_start', '<=', $currentDate)
                ->whereDate('biological_rest_end', '>=', $currentDate);
}

}
