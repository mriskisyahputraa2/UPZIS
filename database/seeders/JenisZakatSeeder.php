<?php

namespace Database\Seeders;

use App\Models\JenisZakat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenisZakatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        JenisZakat::insert([
            [
                'name' => 'Zakat Maal (Simpanan & Emas)',
                'description' => 'Zakat atas harta simpanan (tabungan, deposito) atau emas/perak yang telah mencapai nisab 85 gr emas dan dimiliki selama 1 tahun (haul).',
                'rate_percent' => 2.50,
                'nisab_basis' => 'emas',
                'nisab_quantity' => 85,
                'status' => 'Aktif',
            ],
            [
                'name' => 'Zakat Profesi / Penghasilan',
                'description' => 'Zakat atas penghasilan dari pekerjaan (gaji, bonus). Dikeluarkan per bulan jika penghasilan sudah mencapai nisab (setara 1/12 dari 85 gr emas).',
                'rate_percent' => 2.50,
                'nisab_basis' => 'emas',
                'nisab_quantity' => 85,
                'status' => 'Aktif',
            ],
            [
                'name' => 'Zakat Perdagangan',
                'description' => 'Zakat atas aset lancar dari usaha (stok barang + uang tunai) dikurangi utang jangka pendek. Wajib dikeluarkan setelah mencapai nisab & haul.',
                'rate_percent' => 2.50,
                'nisab_basis' => 'emas',
                'nisab_quantity' => 85,
                'status' => 'Aktif',
            ]
        ]);
    }
}
