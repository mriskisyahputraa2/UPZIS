<?php

namespace App\Services\Admin;

use App\Repositories\Admin\SettingRepository;
use Illuminate\Support\Facades\Cache;

/**
 * Class SettingService
 *
 * Service ini menangani logika bisnis yang terkait dengan pengelolaan pengaturan.
 */
class SettingService
{
    /**
     * @var SettingRepository
     */
    protected $settingRepository;

    /**
     * Kunci pengaturan pembayaran yang akan diambil.
     *
     * @var array
     */
    protected const PAYMENT_KEYS = ['payment_dana', 'payment_gopay', 'payment_tunai'];

    /**
     * SettingService constructor.
     *
     * @param  SettingRepository  $settingRepository
     */
    public function __construct(SettingRepository $settingRepository)
    {
        $this->settingRepository = $settingRepository;
    }

    /**
     * Mengambil semua pengaturan umum.
     *
     * @return array
     */
    public function getGeneralSettings(): array
    {
        return $this->settingRepository->getAllAsArray();
    }

    /**
     * Memperbarui pengaturan umum dan menangani logika cache.
     *
     * @param  array  $data
     * @return void
     */
    public function updateGeneralSettings(array $data): void
    {
        $this->settingRepository->updateMany($data);

        // Aturan Bisnis: Jika harga emas diperbarui, hapus cache-nya.
        if (array_key_exists('harga_emas_per_gram', $data)) {
            Cache::forget('harga_emas_per_gram');
        }
    }

    /**
     * Mengambil dan memformat pengaturan pembayaran.
     *
     * @return array
     */
    public function getPaymentSettings(): array
    {
        $settings = $this->settingRepository->getSettingsByKeys(self::PAYMENT_KEYS)
            ->pluck('setting_value', 'setting_key');

        // Logika Bisnis: Decode setiap nilai JSON menjadi array.
        return [
            'dana' => json_decode($settings->get('payment_dana'), true),
            'gopay' => json_decode($settings->get('payment_gopay'), true),
            'tunai' => json_decode($settings->get('payment_tunai'), true),
        ];
    }

    /**
     * Memperbarui pengaturan pembayaran.
     *
     * @param  array  $data
     * @return void
     */
    public function updatePaymentSettings(array $data): void
    {
        $formattedData = [];
        // Logika Bisnis: Encode setiap nilai array menjadi JSON sebelum disimpan.
        foreach ($data as $key => $value) {
            $formattedData['payment_'.$key] = json_encode($value);
        }

        $this->settingRepository->updateMany($formattedData);
    }
}
