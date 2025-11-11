<?php

namespace App\Repositories\User;

use App\Models\Setting;
use App\Models\Transaksi;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class TransaksiRepository
 *
 * Bertanggung jawab untuk semua interaksi database yang terkait dengan model Transaksi dan Setting terkait.
 *
 * @package App\Repositories\User
 */
class TransaksiRepository
{
    /**
     * Mencari transaksi berdasarkan order_id dan user_id.
     * Melemparkan exception jika tidak ditemukan.
     *
     * @param string $orderId ID unik dari order.
     * @param int $userId ID dari user yang terautentikasi.
     * @return Transaksi
     * @throws ModelNotFoundException
     */
    public function findByOrderIdAndUser(string $orderId, int $userId): Transaksi
    {
        return Transaksi::where('order_id', $orderId)
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    /**
     * Membuat record transaksi baru di database.
     *
     * @param array $data Data untuk membuat transaksi.
     * @return Transaksi
     */
    public function create(array $data): Transaksi
    {
        return Transaksi::create($data);
    }

    /**
     * Memperbarui record transaksi yang ada.
     *
     * @param Transaksi $transaksi Model transaksi yang akan diperbarui.
     * @param array $data Data baru untuk transaksi.
     * @return bool
     */
    public function update(Transaksi $transaksi, array $data): bool
    {
        return $transaksi->update($data);
    }

    /**
     * Mengambil nilai pengaturan harga emas per gram dari database.
     *
     * @return float
     */
    public function getHargaEmas(): float
    {
        $hargaEmas = Setting::where('setting_key', 'harga_emas_per_gram')->value('setting_value');
        return (float) $hargaEmas;
    }

    /**
     * Mengambil detail pengaturan pembayaran berdasarkan metode pembayaran.
     *
     * @param string $paymentMethod Metode pembayaran (e.g., 'DANA', 'GoPay').
     * @return Setting|null
     */
    public function getPaymentSetting(string $paymentMethod): ?Setting
    {
        $paymentKey = 'payment_' . strtolower($paymentMethod);
        return Setting::where('setting_key', $paymentKey)->first();
    }
}
