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
        Schema::table('permohonans', function (Blueprint $table) {
            $table->string('file_surat_fakir_miskin')->nullable()->after('file_khs');
            $table->string('file_tidak_menerima_beasiswa')->nullable()->after('file_surat_fakir_miskin');
            $table->string('file_surat_permohonan')->nullable()->after('file_tidak_menerima_beasiswa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonans', function (Blueprint $table) {
            //
        });
    }
};
