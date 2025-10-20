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
        Schema::create('permohonan_dokumens', function (Blueprint $table) {
            $table->id();
            // Kolom ini menghubungkan ke permohonan, dibuat unik agar hubungannya one-to-one
            $table->foreignId('permohonan_id')->unique()->constrained('permohonans')->onDelete('cascade');

            // Semua kolom file dipindahkan ke sini
            $table->string('file_ktp')->nullable();
            $table->string('file_kk')->nullable();
            $table->string('file_khs')->nullable();
            $table->string('file_surat_fakir_miskin')->nullable();
            $table->string('file_tidak_menerima_beasiswa')->nullable();
            $table->string('file_surat_permohonan')->nullable();
            $table->string('file_rumah_depan')->nullable();
            $table->string('file_rumah_belakang')->nullable();
            $table->string('file_rumah_kiri')->nullable();
            $table->string('file_rumah_kanan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonan_dokumens');
    }
};
