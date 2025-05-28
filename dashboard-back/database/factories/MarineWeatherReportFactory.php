<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MarineWeatherReport;

class MarineWeatherReportFactory extends Factory
{
    protected $model = MarineWeatherReport::class;

    public function definition()
    {
        $waveDanger = ['low', 'moderate', 'high'][rand(0, 2)];
        
        return [
            'region' => $this->faker->city . ' Coast',
            'date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'temperature' => $this->faker->randomFloat(1, 10, 35),
            'wind_speed' => $this->faker->randomFloat(1, 5, 50),
            'wind_direction' => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][rand(0, 7)],
            'rain_probability' => $this->faker->numberBetween(0, 100),
            'wave_height' => $this->faker->randomFloat(1, 0.5, 5),
            'wave_danger' => $waveDanger,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}