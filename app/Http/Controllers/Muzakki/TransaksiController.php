<?php

namespace App\Http\Controllers\Muzakki;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreTransaksiRequest;
use App\Http\Requests\User\UploadProofRequest;
use App\Services\User\TransaksiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Class TransaksiController
 *
 * Menangani alur permintaan HTTP untuk transaksi muzakki.
 * Controller ini bertugas menerima request, memanggil service yang sesuai,
 * dan mengembalikan response (biasanya dalam bentuk view Inertia atau redirect).
 *
 * @package App\Http\Controllers\Muzakki
 */
class TransaksiController extends Controller
{
    /**
     * @var TransaksiService
     */
    protected TransaksiService $transaksiService;

    /**
     * TransaksiController constructor.
     *
     * @param TransaksiService $transaksiService
     */
    public function __construct(TransaksiService $transaksiService)
    {
        $this->transaksiService = $transaksiService;
    }

    /**
     * Menampilkan halaman pemilihan jenis donasi.
     */
    public function selectDonationType()
    {
        return Inertia::render('user/muzakki/transaksi/donasi/select-donation');
    }

    /**
     * Menampilkan halaman form untuk membayar zakat.
     */
    public function create(Request $request)
    {
        return Inertia::render('user/muzakki/transaksi/zakat/create-zakat', [
            'initialAmount' => $request->query('amount', ''),
            'hargaEmas' => $this->transaksiService->getZakatCreationData(),
        ]);
    }

    /**
     * Menampilkan halaman form untuk INFAQ & SEDEKAH.
     */
    public function createInfaqSedekah(string $type)
    {
        return Inertia::render('user/muzakki/transaksi/donasi/create-infaq-sedekah', [
            'donationType' => $type,
        ]);
    }

    /**
     * Menyimpan transaksi baru ke database.
     */
    public function store(StoreTransaksiRequest $request)
    {
        $transaksi = $this->transaksiService->createTransaksi($request->validated());

        return redirect('/transaksi/' . $transaksi->order_id)
            ->with('success', 'Transaksi berhasil dibuat. Silakan selesaikan pembayaran.');
    }

    /**
     * Menampilkan detail transaksi dan form upload bukti.
     */
    public function show($order_id)
    {
        $data = $this->transaksiService->getTransaksiDetails($order_id);

        return Inertia::render('user/muzakki/transaksi/zakat/show-zakat', [
            'transaksi' => $data['transaksi'],
            'paymentDetails' => $data['paymentDetails'],
        ]);
    }

    /**
     * Mengunggah dan memproses bukti pembayaran.
     */
    public function uploadProof(UploadProofRequest $request, $order_id)
    {
        $this->transaksiService->handleProofUpload($order_id, $request->file('payment_proof'));

        return back()->with('success', 'Bukti pembayaran berhasil diunggah.');
    }
}
