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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel users (Muzakki)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_id', 100)->unique(); //
            $table->decimal('amount', 15, 2); //
            $table->integer('unique_code')->nullable(); // Kode unik untuk transfer, bisa null jika tidak diperlukan
            $table->decimal('final_amount', 15, 2); // Nominal akhir setelah ditambah kode unik
            $table->string('payment_method', 100); //
            $table->string('payment_proof')->nullable(); // Path ke file bukti, null saat record dibuat
            $table->string('status', 50)->default('Menunggu Pembayaran');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
