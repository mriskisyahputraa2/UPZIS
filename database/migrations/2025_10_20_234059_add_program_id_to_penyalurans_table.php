<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('penyalurans', function (Blueprint $table) {
            // Kolom ini adalah "lem" yang menghubungkan penyaluran ke program

            $table->foreignId('program_id')->nullable()->after('permohonan_id')->constrained('programs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penyalurans', function (Blueprint $table) {
            // 1. Hapus foreign key constraint terlebih dahulu
            $table->dropForeign(['program_id']);
            // 2. Baru hapus kolomnya
            $table->dropColumn('program_id');
        });
    }
};
