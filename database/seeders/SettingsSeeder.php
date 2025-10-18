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
            ['setting_key' => 'contact_address', 'setting_value' => 'Alamat lengkap sekretariat UPZIS Anda.'],
            ['setting_key' => 'contact_phone', 'setting_value' => '081234567890'],
            ['setting_key' => 'contact_email', 'setting_value' => 'kontak@upzis.com'],
        ];

        // Gunakan updateOrCreate untuk keamanan
        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['setting_key' => $setting['setting_key']], // Cari berdasarkan ini
                ['setting_value' => $setting['setting_value']] // Update atau buat dengan ini
            );
        }
    }
}
