<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'setting_key' => 'payment_dana',
                'setting_value' => json_encode([
                    'account' => '081234567890',
                    'name' => 'UPZIS Final',
                    'steps' => [
                        'Buka aplikasi DANA Anda.',
                        'Pilih menu "Kirim".',
                        'Pilih "Kirim ke Nomor Telepon" dan masukkan nomor di atas.',
                        'Masukkan nominal transfer sesuai jumlah yang tertera.',
                        'Screenshot bukti transfer untuk diunggah.',
                    ],
                ]),
            ],
            [
                'setting_key' => 'payment_gopay',
                'setting_value' => json_encode([
                    'account' => '089876543210',
                    'name' => 'UPZIS Final',
                    'steps' => [
                        'Buka aplikasi Gojek Anda.',
                        'Pilih menu "Bayar".',
                        'Pilih "Ke rekening bank" atau "Ke nomor HP".',
                        'Masukkan detail akun GoPay di atas.',
                        'Masukkan nominal transfer sesuai jumlah yang tertera.',
                        'Screenshot bukti transfer untuk diunggah.',
                    ],
                ]),
            ],
            [
                'setting_key' => 'payment_tunai',
                'setting_value' => json_encode([
                    'account' => 'Sekretariat UPZIS Final',
                    'name' => 'Jl. Kebaikan No. 123, Kota Berkah',
                    'steps' => [
                        'Silakan datang langsung ke alamat sekretariat kami.',
                        'Tunjukkan Order ID Anda kepada petugas.',
                        'Lakukan pembayaran secara tunai.',
                        'Anda akan mendapatkan bukti pembayaran fisik dari petugas.',
                    ],
                ]),
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['setting_key' => $setting['setting_key']], $setting);
        }
    }
}
