<?php

namespace Database\Seeders;

use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermohonanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mustahiks = Mustahik::all();
        $periodes = Periode::all();
        $statuses = ['Baru', 'Diverifikasi', 'Disetujui', 'Ditolak'];

        if ($mustahiks->isEmpty() || $periodes->isEmpty()) {
            $this->command->info('Tidak ada data Mustahik atau Periode. Silakan jalankan seeder yang lain terlebih dahulu.');
            return;
        }

        foreach ($mustahiks as $mustahik) {
            // Setiap mustahik akan mendaftar di salah satu periode secara acak
            $randomPeriode = $periodes->random();

            Permohonan::create([
                'mustahik_id' => $mustahik->id,
                'periode_id' => $randomPeriode->id,
                'unique_code' => 'ZKM-' . now()->year . '-' . Str::random(8),
                'status' => $statuses[array_rand($statuses)], // Status acak
                'file_ktp' => 'dummy/ktp.pdf', // Path dummy
                'file_kk' => 'dummy/kk.pdf',
                'file_khs' => 'dummy/khs.pdf',
                'notes_admin' => 'Ini adalah catatan dummy yang dibuat oleh seeder.',
            ]);
        }
    }
}
