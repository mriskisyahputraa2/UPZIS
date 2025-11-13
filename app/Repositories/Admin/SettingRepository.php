<?php

namespace App\Repositories\Admin;

use App\Models\Setting;
use Illuminate\Support\Collection;

/**
 * Class SettingRepository
 *
 * Repositori ini bertanggung jawab untuk semua interaksi database
 * yang terkait dengan model Setting.
 */
class SettingRepository
{
    /**
     * Mengambil semua pengaturan dan mengembalikannya sebagai array asosiatif.
     *
     * @return array
     */
    public function getAllAsArray(): array
    {
        return Setting::all()->pluck('setting_value', 'setting_key')->all();
    }

    /**
     * Mengambil pengaturan pembayaran spesifik.
     *
     * @param  array  $keys
     * @return Collection
     */
    public function getSettingsByKeys(array $keys): Collection
    {
        return Setting::whereIn('setting_key', $keys)->get();
    }

    /**
     * Memperbarui atau membuat beberapa pengaturan sekaligus.
     *
     * @param  array  $settings - Array asosiatif ['setting_key' => 'setting_value']
     * @return void
     */
    public function updateMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }
    }
}
