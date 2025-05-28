<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddQuantityToSpeciesZoneTable extends Migration
{
    public function up()
    {
        Schema::table('species_zone', function (Blueprint $table) {
            // عدد الأسماك (يمكن يكون null إذا ما تمش التحديد بعد)
            $table->unsignedInteger('quantity')->nullable()->after('zone_id');
        });
    }

    public function down()
    {
        Schema::table('species_zone', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
}
