<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndexTransaksiRequest;
use App\Http\Requests\Admin\UpdateTransaksiStatusRequest;
use App\Models\Transaksi;
use App\Repositories\Admin\TransaksiAdminRepository;
use App\Services\Admin\TransaksiAdminService;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * @summary Controller untuk mengelola data Transaksi dari sisi Admin.
 *
 * @description
 * Controller ini bertanggung jawab untuk menangani request HTTP terkait
 * data transaksi, seperti menampilkan daftar, detail, pembaruan status,
 * dan ekspor data. Logika utama didelegasikan ke TransaksiAdminService.
 */
class TransaksiAdminController extends Controller
{
    /**
     * @param TransaksiAdminService $service
     * @param TransaksiAdminRepository $repository
     */
    public function __construct(
        protected TransaksiAdminService $service,
        protected TransaksiAdminRepository $repository
    ) {
    }

    /**
     * @summary Menampilkan daftar semua transaksi dengan filter.
     *
     * @param IndexTransaksiRequest $request
     * @return \Inertia\Response
     */
    public function index(IndexTransaksiRequest $request): \Inertia\Response
    {
        $query = $this->repository->getFilteredTransactionsQuery($request);

        $transaksis = $query->paginate($request->input('per_page', 5))
            ->withQueryString()
            ->through(
                fn($transaksi) => [
                    'id' => $transaksi->id,
                    'order_id' => $transaksi->order_id,
                    'final_amount' => $transaksi->final_amount,
                    'payment_method' => $transaksi->payment_method,
                    'status' => $transaksi->status,
                    'type' => $transaksi->type,
                    'formatted_date' => $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y'),
                    'formatted_time' => $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('H:i:s T'),
                    'user' => $transaksi->user ? ['name' => $transaksi->user->name] : null,
                ],
            );

        return Inertia::render('admin/transaksi-admin/index', [
            'transaksis' => $transaksis,
            'filters' => $request->validated(),
            'periodes' => $this->repository->getAllPeriodes(),
        ]);
    }

    /**
     * @summary Menampilkan detail satu transaksi.
     *
     * @param Transaksi $transaksi
     * @return \Inertia\Response
     */
    public function show(Transaksi $transaksi): \Inertia\Response
    {
        return Inertia::render('admin/transaksi-admin/show', [
            'transaksi' => $this->service->getTransactionDetails($transaksi),
        ]);
    }

    /**
     * @summary Memperbarui status transaksi.
     *
     * @param UpdateTransaksiStatusRequest $request
     * @param Transaksi $transaksi
     * @return RedirectResponse
     */
    public function update(UpdateTransaksiStatusRequest $request, Transaksi $transaksi): RedirectResponse
    {
        $this->service->updateStatus($request, $transaksi);

        return back()->with('success', 'Status transaksi berhasil diperbarui.');
    }

    /**
     * @summary Menangani permintaan ekspor data ke format Excel.
     *
     * @param IndexTransaksiRequest $request
     * @return BinaryFileResponse
     */
    public function exportExcel(IndexTransaksiRequest $request): BinaryFileResponse
    {
        return $this->service->exportExcel($request);
    }

    /**
     * @summary Menangani permintaan ekspor data ke format PDF.
     *
     * @param IndexTransaksiRequest $request
     * @return Response
     */
    public function exportPdf(IndexTransaksiRequest $request): Response
    {
        return $this->service->exportPdf($request);
    }
}