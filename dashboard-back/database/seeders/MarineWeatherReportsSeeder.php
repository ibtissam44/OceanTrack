<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarineWeatherReport;

class MarineWeatherReportsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'region' => 'طنجة',
                'date' => now(),
                'temperature' => 22.5,
                'wind_speed' => 15.2,
                'wind_direction' => 'NW',
                'rain_probability' => 10,
                'wave_height' => 1.2,
                'wave_danger' => 'Faible',
                'latitude' => 35.7673,
                'longitude' => -5.7998,
            ],
            [
                'region' => 'الدار البيضاء',
                'date' => now(),
                'temperature' => 24.0,
                'wind_speed' => 12.8,
                'wind_direction' => 'W',
                'rain_probability' => 5,
                'wave_height' => 1.0,
                'wave_danger' => 'Aucun',
                'latitude' => 33.5731,
                'longitude' => -7.5898,
            ],
            [
                'region' => 'أكادير',
                'date' => now(),
                'temperature' => 26.7,
                'wind_speed' => 10.0,
                'wind_direction' => 'SW',
                'rain_probability' => 2,
                'wave_height' => 0.8,
                'wave_danger' => 'Aucun',
                'latitude' => 30.4278,
                'longitude' => -9.5981,
            ],
            [
                'region' => 'العيون',
                'date' => now(),
                'temperature' => 28.3,
                'wind_speed' => 18.5,
                'wind_direction' => 'N',
                'rain_probability' => 0,
                'wave_height' => 1.5,
                'wave_danger' => 'Moyen',
                'latitude' => 27.1500,
                'longitude' => -13.1996,
            ],
            [
                'region' => 'الناظور',
                'date' => now(),
                'temperature' => 21.4,
                'wind_speed' => 14.0,
                'wind_direction' => 'NE',
                'rain_probability' => 15,
                'wave_height' => 1.3,
                'wave_danger' => 'Faible',
                'latitude' => 35.1688,
                'longitude' => -2.9287,
            ],
        ];

        foreach ($data as $report) {
            MarineWeatherReport::create($report);
        }
    }
}
