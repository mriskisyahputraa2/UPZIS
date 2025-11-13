<?php

namespace App\Services\Admin;

use App\Exports\TransaksisExport;
use App\Http\Requests\Admin\IndexTransaksiRequest;
use App\Http\Requests\Admin\UpdateTransaksiStatusRequest;
use App\Models\Periode;
use App\Models\Transaksi;
use App\Repositories\Admin\TransaksiAdminRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * @summary Service untuk mengelola logika bisnis terkait Transaksi Admin.
 *
 * @description
 * Kelas ini menangani orkestrasi data dari repository, persiapan data untuk view,
 * pembaruan status, dan proses ekspor data transaksi ke Excel atau PDF.
 */
class TransaksiAdminService
{
    /**
     * @param TransaksiAdminRepository $repository
     */
    public function __construct(protected TransaksiAdminRepository $repository)
    {
    }

    /**
     * @summary Memperbarui status sebuah transaksi.
     *
     * @param UpdateTransaksiStatusRequest $request
     * @param Transaksi $transaksi
     * @return Transaksi
     */
    public function updateStatus(UpdateTransaksiStatusRequest $request, Transaksi $transaksi): Transaksi
    {
        $transaksi->update($request->validated());
        return $transaksi;
    }

    /**
     * @summary Menyiapkan detail transaksi untuk ditampilkan.
     *
     * @param Transaksi $transaksi
     * @return Transaksi
     */
    public function getTransactionDetails(Transaksi $transaksi): Transaksi
    {
        $transaksi->load('user');
        $transaksi->formatted_date = $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y');
        $transaksi->formatted_time = $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('H:i:s T');
        $transaksi->payment_proof_url = $transaksi->payment_proof ? Storage::url($transaksi->payment_proof) : null;

        return $transaksi;
    }

    /**
     * @summary Menangani proses ekspor data ke Excel.
     *
     * @param IndexTransaksiRequest $request
     * @return BinaryFileResponse
     */
    public function exportExcel(IndexTransaksiRequest $request): BinaryFileResponse
    {
        $fileName = $this->generateDynamicFileName($request, '.xlsx');
        return Excel::download(new TransaksisExport($request), $fileName);
    }

    /**
     * @summary Menangani proses ekspor data ke PDF.
     *
     * @param IndexTransaksiRequest $request
     * @return Response
     */
    public function exportPdf(IndexTransaksiRequest $request): Response
    {
        $transaksis = $this->repository->getFilteredTransactionsQuery($request)->get();

        $filtersDescription = $this->getFiltersDescription($request);

        $summary = [
            'totalAmount' => $transaksis->sum('final_amount'),
            'totalTransactions' => $transaksis->count(),
        ];

        $fileName = $this->generateDynamicFileName($request, '.pdf');

        $pdf = Pdf::loadView('reports.transaksi', compact('transaksis', 'filtersDescription', 'summary'));

        return $pdf->download($fileName);
    }

    /**
     * @summary Helper untuk membuat nama file yang dinamis untuk ekspor.
     *
     * @param Request $request
     * @param string $extension
     * @return string
     */
    private function generateDynamicFileName(Request $request, string $extension): string
    {
        $parts = ['laporan-transaksi'];
        if ($request->filled('status')) {
            $parts[] = $request->input('status');
        }
        if ($request->filled('type')) {
            $parts[] = 'jenis-' . $request->input('type');
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $parts[] = 'periode-' . $periode->name;
            }
        }
        $parts[] = now()->format('d-m-Y');

        return Str::slug(implode('-', $parts)) . $extension;
    }

    /**
     * @summary Helper untuk mendapatkan deskripsi filter yang aktif untuk laporan.
     *
     * @param Request $request
     * @return array
     */
    private function getFiltersDescription(Request $request): array
    {
        $desc = [];
        if ($request->filled('status')) {
            $desc['Status'] = $request->input('status');
        }
        if ($request->filled('type')) {
            $desc['Jenis Donasi'] = ucfirst($request->input('type'));
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $desc['Periode'] = $periode->name;
            }
        }
        if ($request->filled('search')) {
            $desc['Pencarian'] = '"' . $request->input('search') . '"';
        }
        return $desc;
    }
}
