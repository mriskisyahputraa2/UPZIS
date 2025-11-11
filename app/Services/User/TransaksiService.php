<?php

namespace App\Services\User;

use App\Models\Transaksi;
use App\Repositories\User\TransaksiRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * Class TransaksiService
 *
 * Menangani semua logika bisnis yang terkait dengan transaksi muzakki.
 *
 * @package App\Services\User
 */
class TransaksiService
{
    /**
     * @var TransaksiRepository
     */
    protected TransaksiRepository $transaksiRepository;

    /**
     * TransaksiService constructor.
     *
     * @param TransaksiRepository $transaksiRepository
     */
    public function __construct(TransaksiRepository $transaksiRepository)
    {
        $this->transaksiRepository = $transaksiRepository;
    }

    /**
     * Membuat transaksi baru berdasarkan data yang divalidasi.
     *
     * @param array $validatedData Data dari StoreTransaksiRequest.
     * @return Transaksi
     */
    public function createTransaksi(array $validatedData): Transaksi
    {
        $dataToCreate = array_merge($validatedData, [
            'user_id' => Auth::id(),
            'order_id' => Str::upper('INV-' . now()->format('Ymd') . '-' . Str::random(6)),
            'final_amount' => $validatedData['amount'],
            'status' => 'Menunggu Pembayaran',
        ]);

        return $this->transaksiRepository->create($dataToCreate);
    }

    /**
     * Menyiapkan data yang diperlukan untuk halaman detail transaksi.
     *
     * @param string $orderId ID unik dari order.
     * @return array
     */
    public function getTransaksiDetails(string $orderId): array
    {
        $transaksi = $this->transaksiRepository->findByOrderIdAndUser($orderId, Auth::id());

        // Format tanggal dan waktu
        $transaksi->formatted_date = $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y');
        $transaksi->formatted_time = $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('H:i T');

        // Ambil detail pembayaran
        $paymentSetting = $this->transaksiRepository->getPaymentSetting($transaksi->payment_method);
        $paymentDetails = $paymentSetting ? json_decode($paymentSetting->setting_value, true) : null;

        return [
            'transaksi' => $transaksi,
            'paymentDetails' => $paymentDetails,
        ];
    }

    /**
     * Menangani logika unggah dan pembaruan bukti pembayaran.
     *
     * @param string $orderId ID unik dari order.
     * @param UploadedFile $file File bukti pembayaran yang diunggah.
     * @return bool
     */
    public function handleProofUpload(string $orderId, UploadedFile $file): bool
    {
        $transaksi = $this->transaksiRepository->findByOrderIdAndUser($orderId, Auth::id());

        // Simpan file baru
        $path = $file->store('bukti_pembayaran', 'public');

        // Update database
        return $this->transaksiRepository->update($transaksi, [
            'payment_proof' => $path,
            'status' => 'Menunggu Verifikasi',
        ]);
    }

    /**
     * Mengambil data harga emas untuk form pembuatan zakat.
     *
     * @return float
     */
    public function getZakatCreationData(): float
    {
        return $this->transaksiRepository->getHargaEmas();
    }
}
