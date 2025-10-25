<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Permohonan; // <-- Pastikan model Permohonan di-import
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanPenyaluranController extends Controller
{
    public function index(Request $request)
    {
       $request->validate([
            'search' => 'nullable|string|max:100',
            'periode_id' => 'nullable|integer|exists:periodes,id',
            'kategori_alokasi' => 'nullable|string|in:kampus,fakir_miskin,infaq,sedekah',
            'kategori_pemohon' => 'nullable|string|in:mahasiswa,umum',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'per_page' => 'nullable|integer|in:10,25,50,100',
        ]);
        // Query dasar untuk memfilter data penyaluran
        $penyaluranQuery = Penyaluran::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('permohonan.mustahik', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($request->input('kategori_pemohon'), function ($query, $kategori) {
                $query->whereHas('permohonan', function ($q) use ($kategori) {
                    $q->where('kategori_pemohon', $kategori);
                });
            })
            ->when($request->input('periode_id'), function ($query, $periodeId) {
                $query->whereHas('permohonan', function ($q) use ($periodeId) {
                    $q->where('periode_id', $periodeId);
                });
            })
            ->when($request->input('kategori_alokasi'), function ($query, $kategori) {
                $query->where('kategori_alokasi', $kategori);
            })
            ->when($request->filled('start_date') && $request->filled('end_date'), function ($query) use ($request) {
                $startDate = Carbon::parse($request->start_date)->startOfDay();
                $endDate = Carbon::parse($request->end_date)->endOfDay();
                $query->whereBetween('distribution_date', [$startDate, $endDate]);
            });

        // Ambil data yang sudah dipaginasi untuk ditampilkan di tabel
        $penyalurans = (clone $penyaluranQuery)
            ->with(['permohonan.mustahik', 'admin:id,name'])
            ->latest('distribution_date')
            ->paginate($request->input('per_page', 5))
            ->withQueryString();

        // ## PERUBAHAN UTAMA DI SINI: Perbaiki cara menghitung mustahik unik ##

        // 1. Ambil semua ID permohonan yang unik dari hasil filter
        $permohonanIds = (clone $penyaluranQuery)->distinct()->pluck('permohonan_id');

        // 2. Hitung jumlah mustahik_id yang unik dari ID permohonan tersebut
        $uniqueMustahikCount = Permohonan::whereIn('id', $permohonanIds)->distinct()->count('mustahik_id');

        // Hitung ringkasan berdasarkan query yang sudah difilter
        $summary = [
            'totalAmount' => (clone $penyaluranQuery)->sum('amount'),
            'uniqueMustahik' => $uniqueMustahikCount, // Gunakan hasil hitungan yang benar
        ];

        return Inertia::render('admin/laporan-penyaluran/index', [
            'penyalurans' => $penyalurans,
            'summary' => $summary,
            'filters' => $request->only(['search', 'periode_id', 'kategori_pemohon', 'kategori_alokasi', 'start_date', 'end_date', 'per_page']),
            'periodes' => Periode::latest()->get(['id', 'name']),
        ]);
    }
}
