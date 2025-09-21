<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'setting_key' => 'harga_emas_per_gram',
            'setting_value' => '1150000' // Ganti dengan harga emas terkini
        ]);
    }
}
