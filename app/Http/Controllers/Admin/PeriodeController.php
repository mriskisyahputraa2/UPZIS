<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePeriodeRequest;
use App\Http\Requests\Admin\UpdatePeriodeRequest;
use App\Models\Periode;
use App\Repositories\Admin\PeriodeRepository;
use App\Services\Admin\PeriodeService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class PeriodeController
 *
 * Controller ini menangani semua tindakan terkait manajemen periode di area admin.
 */
class PeriodeController extends Controller
{
    /**
     * @var PeriodeRepository
     */
    protected $periodeRepository;

    /**
     * @var PeriodeService
     */
    protected $periodeService;

    /**
     * PeriodeController constructor.
     *
     * @param  PeriodeRepository  $periodeRepository
     * @param  PeriodeService  $periodeService
     */
    public function __construct(PeriodeRepository $periodeRepository, PeriodeService $periodeService)
    {
        $this->periodeRepository = $periodeRepository;
        $this->periodeService = $periodeService;
    }

    /**
     * Menampilkan halaman daftar periode.
     *
     * Mengambil data periode secara paginasi menggunakan repository dan
     * menampilkannya menggunakan Inertia.
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $periodes = $this->periodeRepository->getAllPaginated($request);

        return Inertia::render('admin/periode/index', [
            'periodes' => $periodes,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat periode baru.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('admin/periode/create');
    }

    /**
     * Menyimpan periode baru ke database.
     *
     * Validasi input ditangani oleh StorePeriodeRequest.
     * Logika bisnis untuk pembuatan data ditangani oleh PeriodeService.
     *
     * @param  StorePeriodeRequest  $request
     * @return RedirectResponse
     */
    public function store(StorePeriodeRequest $request): RedirectResponse
    {
        try {
            $this->periodeService->createPeriode($request->validated());

            return redirect()->route('admin.periode.index')->with('success', 'Periode baru berhasil ditambahkan.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan periode: '.$e->getMessage());
        }
    }

    /**
     * Menampilkan form untuk mengedit periode.
     *
     * Data periode yang akan diedit diformat untuk memastikan konsistensi
     * format tanggal sebelum dikirim ke frontend.
     *
     * @param  Periode  $periode
     * @return Response
     */
    public function edit(Periode $periode): Response
    {
        return Inertia::render('admin/periode/edit', [
            'periode' => [
                'id' => $periode->id,
                'name' => $periode->name,
                'description' => $periode->description,
                'start_date' => $periode->start_date ? $periode->start_date->format('Y-m-d') : null,
                'end_date' => $periode->end_date ? $periode->end_date->format('Y-m-d') : null,
                'status' => $periode->status,
            ],
        ]);
    }

    /**
     * Memperbarui data periode di database.
     *
     * Validasi input ditangani oleh UpdatePeriodeRequest.
     * Logika bisnis untuk pembaruan data ditangani oleh PeriodeService.
     *
     * @param  UpdatePeriodeRequest  $request
     * @param  Periode  $periode
     * @return RedirectResponse
     */
    public function update(UpdatePeriodeRequest $request, Periode $periode): RedirectResponse
    {
        try {
            $this->periodeService->updatePeriode($periode, $request->validated());

            return redirect()->route('admin.periode.index')->with('success', 'Data periode berhasil diperbarui.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui periode: '.$e->getMessage());
        }
    }

    /**
     * Menghapus periode dari database.
     *
     * Logika bisnis untuk penghapusan data (termasuk pengecekan relasi)
     * ditangani oleh PeriodeService.
     *
     * @param  Periode  $periode
     * @return RedirectResponse
     */
    public function destroy(Periode $periode): RedirectResponse
    {
        try {
            $this->periodeService->deletePeriode($periode);

            return redirect()->route('admin.periode.index')->with('success', 'Periode berhasil dihapus.');
        } catch (Exception $e) {
            return redirect()->route('admin.periode.index')->with('error', $e->getMessage());
        }
    }
}
