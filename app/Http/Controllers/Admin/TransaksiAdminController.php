<?php

namespace App\Http\Controllers\Admin;

use App\Exports\TransaksisExport;
use App\Http\Controllers\Controller;
use App\Models\Periode;
use App\Models\Transaksi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class TransaksiAdminController extends Controller
{
    /**
     * Menampilkan daftar semua transaksi.
     */
    public function index(Request $request)
    {
        // Tambahkan validasi untuk filter 'type'
        $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string',
            'type' => 'nullable|string|in:zakat,infaq,sedekah', // Validasi jenis donasi
            'per_page' => 'nullable|integer|in:5,10,20,50',
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ]);
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
        //Terapkan filter jenis donasi
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }
        // Terapkan filter periode
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                // Pastikan tanggal awal dan akhir mencakup keseluruhan hari dengan Carbon
                $startDate = Carbon::parse($periode->start_date)->startOfDay();
                $endDate = Carbon::parse($periode->end_date)->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
        }

        // Ambil data dengan paginasi dan transformasikan hasilnya
        $transaksis = $query->paginate($request->input('per_page', 5))->withQueryString()->through(
            fn($transaksi) => [
                'id' => $transaksi->id,
                'order_id' => $transaksi->order_id,
                'final_amount' => $transaksi->final_amount,
                'payment_method' => $transaksi->payment_method,
                'status' => $transaksi->status,
                'type' => $transaksi->type,
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

        // Ambil semua periode untuk dropdown filter
        $periodes = Periode::select('id', 'name')->get();

        return Inertia::render('admin/transaksi-admin/index', [
            'transaksis' => $transaksis,
            'filters' => $request->only(['search', 'status', 'type', 'per_page', 'periode_id']),
            'periodes' => $periodes,
        ]);
    }

    /**
     * Menangani permintaan ekspor Excel.
     */
    public function exportExcel(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string',
            'type' => 'nullable|string|in:zakat,infaq,sedekah',
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ]);

        $fileName = $this->generateDynamicFileName($request, '.xlsx');

        return Excel::download(new TransaksisExport($request), $fileName);
    }

    /**
     * Menangani permintaan ekspor PDF.
     */
    public function exportPdf(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string',
            'type' => 'nullable|string|in:zakat,infaq,sedekah',
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ]);

        // Buat query yang sama persis dengan di TransaksisExport
        $query = Transaksi::with('user');
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                });
            });
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $startDate = Carbon::parse($periode->start_date)->startOfDay();
                $endDate = Carbon::parse($periode->end_date)->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
        }
        $transaksis = $query->latest()->get();

        $fileName = $this->generateDynamicFileName($request, '.pdf');

        $pdf = Pdf::loadView('reports.transaksi', ['transaksis' => $transaksis]);
        return $pdf->download($fileName);
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

    /**
     * Helper private untuk membuat nama file yang dinamis berdasarkan filter.
     */
    private function generateDynamicFileName(Request $request, string $extension): string
    {
        $fileNameParts = ['laporan-transaksi'];
        if ($request->filled('status')) {
            $fileNameParts[] = $request->input('status');
        }
        if ($request->filled('type')) {
            $fileNameParts[] = 'jenis-' . $request->input('type');
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $fileNameParts[] = 'periode-' . $periode->name;
            }
        }
        $fileNameParts[] = now()->format('d-m-Y');

        return Str::slug(implode('-', $fileNameParts)) . $extension;
    }
}
