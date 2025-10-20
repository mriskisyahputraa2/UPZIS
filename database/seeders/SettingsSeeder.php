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
        $settings = [
            ['setting_key' => 'harga_emas_per_gram', 'setting_value' => '1150000'],
            ['setting_key' => 'contact_address', 'setting_value' => 'Jl. Banda Aceh-Medan Km. 280,3, Buketrata, Mesjid Punteut, Blang Mangat, Kota Lhokseumawe, 24301, Aceh, Indonesia'],
            ['setting_key' => 'contact_phone', 'setting_value' => '081361508140'],
            ['setting_key' => 'contact_email', 'setting_value' => 'humas@pnl.ac.id'],
            ['setting_key' => 'alokasi_fakir_miskin_persen', 'setting_value' => '10'],
        ];

        // Gunakan updateOrCreate untuk keamanan
        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                ['setting_value' => $setting['setting_value']]
            );
        }
    }
}
