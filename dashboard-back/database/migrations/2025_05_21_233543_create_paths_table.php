<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paths', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('start_zone_id');
            $table->unsignedBigInteger('end_zone_id');
            $table->json('waypoints')->nullable(); // نقاط المسار (array من الاحداثيات)
            $table->boolean('is_safe')->default(true);
            $table->timestamps();

            // الربط بالجدول zones
            $table->foreign('start_zone_id')->references('id')->on('zones')->onDelete('cascade');
            $table->foreign('end_zone_id')->references('id')->on('zones')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paths');
    }
};
