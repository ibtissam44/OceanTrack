<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_species_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSpeciesTable extends Migration
{
    public function up()
    {
        Schema::create('species', function (Blueprint $table) {
            $table->id();
            $table->string('scientific_name'); // الاسم العلمي
            $table->string('local_name')->nullable(); // الاسم المحلي
            $table->string('image_path')->nullable(); // مسار الصورة
            $table->enum('status', ['available', 'fishing_banned', 'rare']); // الحالة
            $table->date('biological_rest_start'); // بداية الراحة البيولوجية
            $table->date('biological_rest_end'); // نهاية الراحة البيولوجية
            $table->text('notes')->nullable(); // ملاحظات إضافية
            $table->integer('quantity');
            $table->string('found_location');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('species');
    }
}
