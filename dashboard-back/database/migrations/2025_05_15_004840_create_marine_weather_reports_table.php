<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marine_weather_reports', function (Blueprint $table) {
            $table->id();
            $table->string('region');
            $table->date('date');
            $table->float('temperature');
            $table->float('wind_speed');
            $table->string('wind_direction');
            $table->float('rain_probability');
            $table->float('wave_height');
            $table->string('wave_danger');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marine_weather_reports');
    }
};

