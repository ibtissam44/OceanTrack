<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // استدعاء DashboardSeeder لتشغيله
        $this->call(DashboardSeeder::class);
        $this->call([
        MarineWeatherReportsSeeder::class,
    ]);
    
    
    }
}
