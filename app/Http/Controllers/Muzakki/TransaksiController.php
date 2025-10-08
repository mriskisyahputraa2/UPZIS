<?php

namespace App\Http\Controllers\Muzakki;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
class TransaksiController extends Controller
{
    /**
     * Menampilkan halaman form untuk membayar zakat.
     */
    public function create(Request $request)
    {
        // Ambil harga emas dari settings
        $hargaEmas = Setting::where('setting_key', 'harga_emas_per_gram')->value('setting_value');

        return Inertia::render('user/muzakki/transaksi/create', [
            // Mengambil 'amount' dari query URL dan meneruskannya sebagai prop
            'initialAmount' => $request->query('amount', ''),
            'hargaEmas' => (float) $hargaEmas,
        ]);
    }

    /**
     * Menyimpan transaksi baru ke database.
     */
    public function store(Request $request)
    {
        // 1. Validasi input dari form
        $request->validate([
            'amount' => 'required|numeric|min:10000', // Minimal pembayaran Rp 10.000
            'payment_method' => 'required|string|in:DANA,GoPay,Tunai',
        ]);

        // 2. Buat record transaksi baru
        $transaksi = Transaksi::create([
            'user_id' => Auth::id(),
            'order_id' => Str::upper('INV-' . now()->format('Ymd') . '-' . Str::random(6)),
            'amount' => $request->amount,
            'final_amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'status' => 'Menunggu Pembayaran',
        ]);

        // 3. Redirect ke halaman detail transaksi (akan dibuat selanjutnya)
        return redirect('/transaksi/' . $transaksi->order_id) // Menggunakan URL manual
            ->with('success', 'Transaksi berhasil dibuat. Silakan selesaikan pembayaran.');
    }

    /**
     * Menampilkan detail transaksi dan form upload bukti.
     */
    public function show($order_id)
    {
        $transaksi = Transaksi::where('order_id', $order_id)->where('user_id', Auth::id())->firstOrFail();

        // Ambil data setting pembayaran dari database
        $paymentKey = 'payment_' . strtolower($transaksi->payment_method);
        $paymentSetting = Setting::where('setting_key', $paymentKey)->first();

        // Decode JSON menjadi array/object
        $paymentDetails = $paymentSetting ? json_decode($paymentSetting->setting_value, true) : null;

        return Inertia::render('user/muzakki/transaksi/show', [
            'transaksi' => $transaksi,
            'paymentDetails' => $paymentDetails, // Kirim data instruksi sebagai prop
        ]);
    }

    /**
     * Mengunggah dan memproses bukti pembayaran.
     */
    public function uploadProof(Request $request, $order_id)
    {
        // 1. Validasi file yang diunggah
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Wajib, gambar, max 2MB
        ]);

        // 2. Cari transaksi yang sesuai
        $transaksi = Transaksi::where('order_id', $order_id)->where('user_id', Auth::id())->firstOrFail();

        // 3. Simpan file baru
        $file = $request->file('payment_proof');
        // Simpan file di dalam folder 'storage/app/public/proofs'
        // dan dapatkan path-nya
        $path = $file->store('bukti_pembayaran', 'public');

        // 4. Update database
        $transaksi->update([
            'payment_proof' => $path,
            'status' => 'Menunggu Verifikasi', // Status berubah
        ]);

        // 5. Kembalikan ke halaman yang sama dengan pesan sukses
        return back()->with('success', 'Bukti pembayaran berhasil diunggah.');
    }
}
