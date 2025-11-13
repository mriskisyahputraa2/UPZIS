<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreZakatTypeRequest;
use App\Http\Requests\Admin\UpdateZakatTypeRequest;
use App\Models\JenisZakat;
use App\Repositories\Admin\ZakatTypeRepository;
use App\Services\Admin\ZakatTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class ZakatTypeController
 *
 * Controller ini menangani semua tindakan terkait manajemen jenis zakat.
 */
class ZakatTypeController extends Controller
{
    /**
     * @var ZakatTypeRepository
     */
    protected $zakatTypeRepository;

    /**
     * @var ZakatTypeService
     */
    protected $zakatTypeService;

    /**
     * ZakatTypeController constructor.
     *
     * @param  ZakatTypeRepository  $zakatTypeRepository
     * @param  ZakatTypeService  $zakatTypeService
     */
    public function __construct(ZakatTypeRepository $zakatTypeRepository, ZakatTypeService $zakatTypeService)
    {
        $this->zakatTypeRepository = $zakatTypeRepository;
        $this->zakatTypeService = $zakatTypeService;
    }

    /**
     * Menampilkan daftar jenis zakat.
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|in:5,10,20,50',
        ]);

        $zakatTypes = $this->zakatTypeRepository->getPaginated($request);

        return Inertia::render('admin/settings/zakat-types/index', [
            'zakatTypes' => $zakatTypes,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat jenis zakat baru.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('admin/settings/zakat-types/create');
    }

    /**
     * Menyimpan jenis zakat baru ke database.
     *
     * @param  StoreZakatTypeRequest  $request
     * @return RedirectResponse
     */
    public function store(StoreZakatTypeRequest $request): RedirectResponse
    {
        $this->zakatTypeService->createZakatType($request->validated());

        return redirect()->route('admin.settings.zakat-types.index')->with('success', 'Jenis zakat berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit jenis zakat.
     *
     * @param  JenisZakat  $zakat_type
     * @return Response
     */
    public function edit(JenisZakat $zakat_type): Response
    {
        return Inertia::render('admin/settings/zakat-types/edit', [
            'jenisZakat' => $zakat_type,
        ]);
    }

    /**
     * Memperbarui jenis zakat di database.
     *
     * @param  UpdateZakatTypeRequest  $request
     * @param  JenisZakat  $zakat_type
     * @return RedirectResponse
     */
    public function update(UpdateZakatTypeRequest $request, JenisZakat $zakat_type): RedirectResponse
    {
        $this->zakatTypeService->updateZakatType($zakat_type, $request->validated());

        return redirect()->route('admin.settings.zakat-types.index')->with('success', 'Jenis zakat berhasil diperbarui.');
    }

    /**
     * Menghapus jenis zakat dari database.
     *
     * @param  JenisZakat  $zakat_type
     * @return RedirectResponse
     */
    public function destroy(JenisZakat $zakat_type): RedirectResponse
    {
        $this->zakatTypeService->deleteZakatType($zakat_type);

        return redirect()->back()->with('success', 'Jenis zakat berhasil dihapus.');
    }
}