<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMustahikRequest;
use App\Http\Requests\Admin\UpdateMustahikRequest;
use App\Models\Mustahik;
use App\Repositories\Admin\MustahikRepository;
use App\Services\Admin\MustahikService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * @summary Controller untuk mengelola data Mustahik di area admin.
 *
 * @description
 * Controller ini bertanggung jawab untuk menangani request HTTP terkait
 * data mustahik, seperti menampilkan, membuat, mengedit, menyimpan,
 * dan menghapus data. Logika bisnis utama ditangani oleh MustahikService.
 */
class MustahikController extends Controller
{
    /**
     * @param MustahikService $mustahikService
     * @param MustahikRepository $mustahikRepository
     */
    public function __construct(
        protected MustahikService $mustahikService,
        protected MustahikRepository $mustahikRepository
    ) {
    }

    /**
     * @summary Menampilkan halaman daftar mustahik.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'periode_id' => 'nullable|integer|exists:periodes,id',
            'jenis_kelamin' => 'nullable|string|in:Laki-laki,Perempuan',
            'kategori_pemohon' => 'nullable|string|in:mahasiswa,umum',
            'per_page' => 'nullable|integer',
        ]);

        $activePeriode = $this->mustahikRepository->getActivePeriode();
        $mustahiks = $this->mustahikRepository->getApprovedMustahiks($request);
        $periodes = $this->mustahikRepository->getAllPeriodes();

        $currentFilters = $request->only(['search', 'per_page', 'periode_id', 'jenis_kelamin', 'kategori_pemohon']);
        if (!$request->has('periode_id') && $activePeriode) {
            $currentFilters['periode_id'] = $activePeriode->id;
        }

        return Inertia::render('admin/mustahiks/index', [
            'mustahiks' => $mustahiks,
            'filters' => $currentFilters,
            'periodes' => $periodes,
            'activePeriode' => $activePeriode,
        ]);
    }

    /**
     * @summary Menampilkan form untuk menambah mustahik baru.
     *
     * @return Response|RedirectResponse
     */
    public function create(): Response|RedirectResponse
    {
        if (!$this->mustahikRepository->getActivePeriode()) {
            return redirect()->route('admin.mustahiks.index')->with('error', 'Tidak ada periode aktif. Silakan aktifkan satu periode untuk menambah data mustahik.');
        }
        return Inertia::render('admin/mustahiks/create');
    }

    /**
     * @summary Menyimpan data mustahik baru ke database.
     *
     * @param StoreMustahikRequest $request
     * @return RedirectResponse
     */
    public function store(StoreMustahikRequest $request): RedirectResponse
    {
        try {
            $this->mustahikService->createMustahik($request);
            return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil ditambahkan.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * @summary Menampilkan halaman detail mustahik.
     *
     * @param Mustahik $mustahik
     * @return Response
     */
    public function show(Mustahik $mustahik): Response
    {
        $data = $this->mustahikService->getMustahikDetails($mustahik);

        return Inertia::render('admin/mustahiks/show', [
            'mustahik' => $data['mustahik'],
            'availableFunds' => $data['availableFunds'],
        ]);
    }

    /**
     * @summary Menampilkan form untuk mengedit data mustahik.
     *
     * @param Mustahik $mustahik
     * @return Response
     */
    public function edit(Mustahik $mustahik): Response
    {
        return Inertia::render('admin/mustahiks/edit', [
            'mustahik' => $this->mustahikRepository->loadEditRelations($mustahik),
        ]);
    }

    /**
     * @summary Memperbarui data mustahik di database.
     *
     * @param UpdateMustahikRequest $request
     * @param Mustahik $mustahik
     * @return RedirectResponse
     */
    public function update(UpdateMustahikRequest $request, Mustahik $mustahik): RedirectResponse
    {
        try {
            $this->mustahikService->updateMustahik($request, $mustahik);
            return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    /**
     * @summary Menghapus data mustahik dari database.
     *
     * @param Mustahik $mustahik
     * @return RedirectResponse
     */
    public function destroy(Mustahik $mustahik): RedirectResponse
    {
        try {
            $this->mustahikService->deleteMustahik($mustahik);
            return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * @summary Menangani permintaan ekspor data ke format Excel.
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportExcel(Request $request): BinaryFileResponse
    {
        return $this->mustahikService->export($request, 'excel');
    }

    /**
     * @summary Menangani permintaan ekspor data ke format PDF.
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportPdf(Request $request): BinaryFileResponse
    {
        return $this->mustahikService->export($request, 'pdf');
    }
}