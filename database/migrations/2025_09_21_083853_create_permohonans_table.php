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
        Schema::create('permohonans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mustahik_id')->constrained('mustahiks')->onDelete('cascade');
            $table->foreignId('periode_id')->constrained('periodes')->onDelete('cascade');
            $table->string('unique_code')->unique();
            $table->string('status', 50)->default('Baru'); // Values: Baru, Diverifikasi, Disetujui, Ditolak
            $table->string('file_ktp')->nullable();
            $table->string('file_kk')->nullable();
            $table->string('file_khs')->nullable();
            $table->text('notes_admin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonans');
    }
};
