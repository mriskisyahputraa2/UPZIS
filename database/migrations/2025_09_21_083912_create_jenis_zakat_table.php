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
        Schema::create('jenis_zakat', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('rate_percent', 5, 2)->default(2.5);
            $table->string('nisab_basis', 50); // Values: emas, perak, beras, dll
            $table->decimal('nisab_quantity', 10, 2); // Contoh: 85 untuk 85 gram emas
            $table->string('status', 50)->default('Aktif'); // Values: Aktif, Tidak Aktif
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_zakat');
    }
};
