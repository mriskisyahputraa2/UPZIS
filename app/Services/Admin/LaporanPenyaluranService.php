<?php

namespace App\Services\Admin;

use App\Exports\PenyaluransExport;
use App\Repositories\Admin\LaporanPenyaluranRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Class LaporanPenyaluranService
 *
 * Menangani semua logika bisnis untuk laporan penyaluran.
 *
 * @package App\Services\Admin
 */
class LaporanPenyaluranService
{
    protected LaporanPenyaluranRepository $repository;

    public function __construct(LaporanPenyaluranRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Menyiapkan data untuk halaman indeks laporan penyaluran.
     *
     * @param array $filters
     * @return array
     */
    public function getIndexData(array $filters): array
    {
        $query = $this->repository->getFilteredQuery($filters);

        $penyalurans = (clone $query)
            ->with(['permohonan.mustahik', 'admin:id,name'])
            ->latest('distribution_date')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();

        return [
            'penyalurans' => $penyalurans,
            'summary' => $this->repository->getSummary($query),
            'filters' => $filters,
            'periodes' => $this->repository->getAllPeriodes(),
        ];
    }

    /**
     * Menangani pembuatan dan download laporan dalam format Excel.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportExcel(Request $request)
    {
        $fileName = $this->generateDynamicFileName($request->all(), '.xlsx');
        return Excel::download(new PenyaluransExport($request), $fileName);
    }

    /**
     * Menangani pembuatan dan download laporan dalam format PDF.
     *
     * @param array $filters
     * @return \Illuminate\Http\Response
     */
    public function exportPdf(array $filters)
    {
        $query = $this->repository->getFilteredQuery($filters);
        $penyalurans = (clone $query)->with(['permohonan.mustahik', 'admin:id,name'])->latest('distribution_date')->get();

        $summary = [
            'totalAmount' => $penyalurans->sum('amount'),
            'jumlahMustahikTerbantu' => $penyalurans->pluck('permohonan.mustahik_id')->unique()->count(),
        ];

        $filtersDescription = $this->getFiltersDescription($filters);
        $fileName = $this->generateDynamicFileName($filters, '.pdf');

        $pdf = Pdf::loadView('reports.laporan-penyaluran', [
            'penyalurans' => $penyalurans,
            'summary' => $summary,
            'filtersDescription' => $filtersDescription,
        ]);

        return $pdf->setPaper('a4', 'landscape')->download($fileName);
    }

    /**
     * Membuat deskripsi filter yang mudah dibaca untuk ditampilkan di PDF.
     *
     * @param array $filters
     * @return array
     */
    private function getFiltersDescription(array $filters): array
    {
        $description = [];
        if ($filters['search'] ?? null) { $description['Pencarian'] = '"' . $filters['search'] . '"'; }
        if ($filters['kategori_pemohon'] ?? null) { $description['Kategori Penerima'] = $filters['kategori_pemohon'] === 'mahasiswa' ? 'Mahasiswa' : 'Umum'; }
        if ($filters['kategori_alokasi'] ?? null) {
            $map = ['kampus' => 'Zakat (Kampus)', 'fakir_miskin' => 'Zakat (Fakir Miskin)', 'infaq' => 'Infaq', 'sedekah' => 'Sedekah'];
            $description['Sumber Dana'] = $map[$filters['kategori_alokasi']] ?? '-';
        }
        if ($filters['periode_id'] ?? null) {
            $periode = $this->repository->findPeriodeById($filters['periode_id']);
            if ($periode) { $description['Periode'] = $periode->name; }
        }
        if (isset($filters['start_date'])) {
            $description['Rentang Waktu'] = Carbon::parse($filters['start_date'])->format('d M Y') . ' - ' . Carbon::parse($filters['end_date'])->format('d M Y');
        }
        return $description;
    }

    /**
     * Membuat nama file yang dinamis berdasarkan filter yang aktif.
     *
     * @param array $filters
     * @param string $extension
     * @return string
     */
    private function generateDynamicFileName(array $filters, string $extension): string
    {
        $parts = ['laporan-penyaluran'];
        if ($filters['periode_id'] ?? null) {
            $periode = $this->repository->findPeriodeById($filters['periode_id']);
            if ($periode) { $parts[] = 'periode-' . $periode->name; }
        }
        if ($filters['kategori_alokasi'] ?? null) {
            $parts[] = $filters['kategori_alokasi'];
        }
        $parts[] = now()->format('d-m-Y');
        return Str::slug(implode('-', $parts)) . $extension;
    }
}
