<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TransaksiAdminController extends Controller
{
    /**
     * Menampilkan daftar semua transaksi.
     */
    public function index(Request $request)
    {
        $query = Transaksi::with('user')->latest();

        // Terapkan filter pencarian
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Terapkan filter status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Ambil data dengan paginasi dan transformasikan hasilnya
        $transaksis = $query->paginate($request->input('per_page', 5))->withQueryString()->through(
            fn($transaksi) => [
                'id' => $transaksi->id,
                'order_id' => $transaksi->order_id,
                'final_amount' => $transaksi->final_amount,
                'payment_method' => $transaksi->payment_method,
                'status' => $transaksi->status,
                // Kirim tanggal dan waktu yang sudah diformat dari server
                'formatted_date' => $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y'),
                'formatted_time' => $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('H:i:s T'),

                   'user' => $transaksi->user
                    ? [
                        'name' => $transaksi->user->name,
                    ]
                    : null,
            ],
        );

        return Inertia::render('admin/transaksi-admin/index', [
            'transaksis' => $transaksis,
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    /**
     * Memperbarui status transaksi.
     */
    public function update(Request $request, Transaksi $transaksi)
    {
        $request->validate([
            'status' => ['required', Rule::in(['Menunggu Pembayaran', 'Menunggu Verifikasi', 'Berhasil', 'Gagal', 'Kadaluarsa'])],
        ]);

        $transaksi->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Status transaksi berhasil diperbarui.');
    }

    /**
     * Menampilkan detail satu transaksi untuk verifikasi.
     */
    public function show(Transaksi $transaksi)
    {
        // Muat relasi user
        $transaksi->load('user');

        // Tambahkan atribut tanggal dan waktu yang sudah diformat
        $transaksi->formatted_date = $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y');
        $transaksi->formatted_time = $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('H:i:s T');

        // Buat URL untuk bukti pembayaran jika ada
        if ($transaksi->payment_proof) {
            $transaksi->payment_proof_url = Storage::url($transaksi->payment_proof);
        } else {
            $transaksi->payment_proof_url = null;
        }

        return Inertia::render('admin/transaksi-admin/show', [
            'transaksi' => $transaksi,
        ]);
    }
}
