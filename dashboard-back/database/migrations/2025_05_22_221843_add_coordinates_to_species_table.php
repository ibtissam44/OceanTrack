<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCoordinatesToSpeciesTable extends Migration
{
    public function up()
    {
        // الأعمدة موجودة مسبقاً في مايجريشن سابقة، لا داعي لإعادة الإضافة
    }

    public function down()
    {
        // لا حاجة لإزالة الأعمدة لأنها ليست مضمنة هنا
    }
}
