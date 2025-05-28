<?php



namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Zone; 

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        
        for ($i = 0; $i < 10; $i++) {
            Zone::create([
                'name' => 'Zone ' . $i,
                'latitude' => rand(-90, 90) + rand(0, 1000000) / 1000000,
                'longitude' => rand(-180, 180) + rand(0, 1000000) / 1000000,
                'status' => 'allowed',
            ]);
        }
    }
}

