<?php

namespace Database\Seeders;

use App\Models\Zone;
use App\Models\Alert;
use App\Models\WeatherData;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;

class DashboardSeeder extends Seeder
{
    public function run()
    {
        // ✅ مناطق مسموح بها الصيد (Allowed)
        Zone::factory()->count(10)->create([
            'status' => 'allowed',
        ])->each(function ($zone) {
            $zone->latitude = fake()->latitude(20, 36); // إحداثيات عشوائية داخل المغرب
            $zone->longitude = fake()->longitude(-17, -1);
            $zone->save();
        });

        // ❌ مناطق ممنوعة (Forbidden)
        Zone::factory()->count(5)->create([
            'status' => 'forbidden',
            'reason' => 'راحة بيولوجية',
        ])->each(function ($zone) {
            $zone->latitude = fake()->latitude(20, 36);
            $zone->longitude = fake()->longitude(-17, -1);
            $zone->save();
        });

        // ⚠️ تحذيرات
        Alert::factory()->count(3)->create([
            'is_active' => true,
        ]);

        // 🌤️ بيانات الطقس
        WeatherData::create([

            'summary' => 'Ciel dégagé, vent modéré, température 24°C.',

        ]);

        // 📊 سجل النشاطات
        foreach (range(1, 15) as $i) {
            ActivityLog::create([
                'date' => now()->subDays(15 - $i)->toDateString(),
                'value' => rand(20, 100)
            ]);
        }
    }
}
