<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\PenyaluransExport;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Permohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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


    /**
     * Menangani ekspor Excel
     */
    public function exportExcel(Request $request)
    {
        $fileName = $this->generateDynamicFileName($request, '.xlsx');
        return Excel::download(new PenyaluransExport($request), $fileName);
    }

    /**
     * Menangani ekspor PDF
     */
  public function exportPdf(Request $request)
    {
        $penyalurans = $this->getFilteredQuery($request)->with(['permohonan.mustahik', 'admin:id,name'])->latest('distribution_date')->get();
        $summary = [
            'totalAmount' => $penyalurans->sum('amount'),
            'jumlahMustahikTerbantu' => $penyalurans->pluck('permohonan.mustahik_id')->unique()->count(),
        ];
        $filtersDescription = $this->getFiltersDescription($request);
        $fileName = $this->generateDynamicFileName($request, '.pdf');

        $pdf = Pdf::loadView('reports.laporan-penyaluran', [
            'penyalurans' => $penyalurans,
            'summary' => $summary,
            'filtersDescription' => $filtersDescription,
        ]);

        return $pdf->setPaper('a4', 'landscape')->download($fileName);
    }

    /**
     * Helper untuk query filter
     */
private function getFilteredQuery(Request $request)
    {
        return Penyaluran::query()
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
    }

    /**
     * Helper untuk deskripsi filter di PDF
     */
private function getFiltersDescription(Request $request): array
    {
        $filtersDescription = [];
        if ($request->filled('search')) { $filtersDescription['Pencarian'] = '"' . $request->input('search') . '"'; }
        if ($request->filled('kategori_pemohon')) { $filtersDescription['Kategori Penerima'] = $request->input('kategori_pemohon') === 'mahasiswa' ? 'Mahasiswa' : 'Fakir/Miskin'; }
        if ($request->filled('kategori_alokasi')) {
            $kategoriMap = ['kampus' => 'Zakat (Kampus)', 'fakir_miskin' => 'Zakat (Fakir Miskin)', 'infaq' => 'Infaq', 'sedekah' => 'Sedekah'];
            $filtersDescription['Sumber Dana'] = $kategoriMap[$request->input('kategori_alokasi')] ?? '-';
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) { $filtersDescription['Periode'] = $periode->name; }
        }
        if ($request->filled('start_date')) {
            $filtersDescription['Rentang Waktu'] = Carbon::parse($request->start_date)->format('d M Y') . ' - ' . Carbon::parse($request->end_date)->format('d M Y');
        }
        return $filtersDescription;
    }
    /**
     * Helper untuk nama file dinamis
     */
private function generateDynamicFileName(Request $request, string $extension): string
    {
        $fileNameParts = ['laporan-penyaluran'];
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) { $fileNameParts[] = 'periode-' . $periode->name; }
        }
        if ($request->filled('kategori_alokasi')) {
            $fileNameParts[] = $request->input('kategori_alokasi');
        }
        $fileNameParts[] = now()->format('d-m-Y');
        return Str::slug(implode('-', $fileNameParts)) . $extension;
    }
}
