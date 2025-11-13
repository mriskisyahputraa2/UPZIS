<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LaporanPenyaluranRequest;
use App\Services\Admin\LaporanPenyaluranService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Class LaporanPenyaluranController
 *
 * Menangani permintaan HTTP untuk laporan penyaluran.
 * Meneruskan logika bisnis ke LaporanPenyaluranService.
 *
 * @package App\Http\Controllers\Admin
 */
class LaporanPenyaluranController extends Controller
{
    protected LaporanPenyaluranService $service;

    public function __construct(LaporanPenyaluranService $service)
    {
        $this->service = $service;
    }

    /**
     * Menampilkan halaman utama laporan penyaluran dengan data yang difilter.
     *
     * @param LaporanPenyaluranRequest $request
     * @return \Inertia\Response
     */
    public function index(LaporanPenyaluranRequest $request)
    {
        $data = $this->service->getIndexData($request->validated());

        return Inertia::render('admin/laporan-penyaluran/index', $data);
    }

    /**
     * Menangani ekspor laporan ke format Excel.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportExcel(Request $request)
    {
        // Catatan: PenyaluransExport masih menggunakan Request object secara langsung.
        // Untuk menjaga kompatibilitas, kita teruskan object Request ke service.
        return $this->service->exportExcel($request);
    }

    /**
     * Menangani ekspor laporan ke format PDF.
     *
     * @param LaporanPenyaluranRequest $request
     * @return \Illuminate\Http\Response
     */
    public function exportPdf(LaporanPenyaluranRequest $request)
    {
        return $this->service->exportPdf($request->validated());
    }
}
