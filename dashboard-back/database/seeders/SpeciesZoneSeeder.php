<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Zone;
use App\Models\Species;

class SpeciesZoneSeeder extends Seeder
{
    public function run()
    {
        $zones = Zone::all();
        $species = Species::all();

        foreach ($zones as $zone) {
            // نختار من 2 إلى 4 أنواع عشوائية من الأسماك
            $randomSpecies = $species->random(rand(2, 4));

            foreach ($randomSpecies as $sp) {
                $zone->species()->attach($sp->id, [
                    'quantity' => rand(10, 100),
                ]);
            }
        }
    }
}
