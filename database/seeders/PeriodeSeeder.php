<?php

namespace Database\Seeders;

use App\Models\Periode;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PeriodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Periode::create([
            'name' => 'Bantuan Mahasiswa 2024',
            'description' => 'Periode bantuan untuk mahasiswa semester akhir tahun 2024.',
            'start_date' => '2024-09-01',
            'end_date' => '2024-09-30',
            'status' => 'Tidak Aktif',
        ]);

        Periode::create([
            'name' => 'Bantuan Mahasiswa 2025',
            'description' => 'Periode bantuan untuk mahasiswa semester akhir tahun 2025.',
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-30',
            'status' => 'Aktif',
        ]);
    }
}
