<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mustahiks', function (Blueprint $table) {
            $table->string('pekerjaan')->nullable()->after('jenis_kelamin');
            $table->integer('jumlah_tanggungan')->default(0)->after('pekerjaan');
            $table->string('status_rumah')->nullable()->after('jumlah_tanggungan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mustahiks', function (Blueprint $table) {
            //
        });
    }
};
