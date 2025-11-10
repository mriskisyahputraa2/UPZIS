<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StorePermohonanBantuanRequest;
use App\Repositories\User\PermohonanBantuanRepository;
use App\Services\User\PermohonanBantuanService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class PermohonanBantuanController
 * @package App\Http\Controllers
 * @description Controller untuk menangani alur permohonan bantuan dari sisi publik (user).
 * Controller ini menerapkan Service dan Repository Pattern, sehingga hanya bertanggung jawab
 * untuk menerima HTTP request dan memberikan HTTP response.
 */
class PermohonanBantuanController extends Controller
{
    /**
     * @var PermohonanBantuanService
     */
    protected $permohonanService;

    /**
     * @var PermohonanBantuanRepository
     */
    protected $permohonanRepository;

    /**
     * PermohonanBantuanController constructor.
     * Dependency Injection untuk Service dan Repository.
     *
     * @param PermohonanBantuanService $permohonanService
     * @param PermohonanBantuanRepository $permohonanRepository
     */
    public function __construct(PermohonanBantuanService $permohonanService, PermohonanBantuanRepository $permohonanRepository)
    {
        $this->permohonanService = $permohonanService;
        $this->permohonanRepository = $permohonanRepository;
    }

    /**
     * Menampilkan formulir untuk membuat permohonan bantuan.
     *
     * @return Response
     */
    public function create(): Response
    {
        // Mengambil data periode aktif melalui repository dan menampilkannya di view.
        return Inertia::render('user/permohonan/create', [
            'activePeriode' => $this->permohonanRepository->findActivePeriode(),
        ]);
    }

    /**
     * Menyimpan permohonan bantuan baru yang dikirim dari formulir.
     * Validasi request ditangani oleh `StorePermohonanBantuanRequest`.
     * Logika bisnis dieksekusi oleh `PermohonanBantuanService`.
     *
     * @param StorePermohonanBantuanRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StorePermohonanBantuanRequest $request)
    {
        try {
            // Memanggil service untuk memproses data
            $permohonan = $this->permohonanService->storePermohonan($request);

            // Jika berhasil, redirect ke halaman sukses dengan kode unik
            return redirect()->route('permohonan.success')->with('unique_code', $permohonan->unique_code);
        } catch (\Exception $e) {
            // Jika terjadi error di service (misal: periode tidak aktif atau error transaksi),
            // kembali ke halaman sebelumnya dengan pesan error.
            return back()->with('error', 'Terjadi kesalahan pada sistem: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Menampilkan halaman sukses setelah pendaftaran permohonan.
     *
     * @return Response|\Illuminate\Http\RedirectResponse
     */
    public function success()
    {
        // Memastikan halaman ini hanya bisa diakses setelah berhasil submit form.
        if (!session('unique_code')) {
            return redirect()->route('home');
        }

        return Inertia::render('user/permohonan/success', [
            'unique_code' => session('unique_code'),
        ]);
    }

    /**
     * Menampilkan halaman dan hasil pelacakan status permohonan.
     *
     * @param Request $request
     * @return Response
     */
    public function lacak(Request $request): Response
    {
        // Validasi input sederhana untuk pelacakan
        $validated = $request->validate([
            'kode' => 'nullable|string|max:255',
            'identifier' => 'nullable|string|max:255',
        ]);

        // Memanggil service untuk melakukan logika pelacakan
        $permohonan = $this->permohonanService->lacakPermohonan($request);

        return Inertia::render('user/permohonan/lacak', [
            'permohonan' => $permohonan,
            'filters' => $validated,
        ]);
    }
}