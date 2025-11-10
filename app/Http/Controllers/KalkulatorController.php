<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\HitungZakatRequest;
use App\Services\User\KalkulatorService;
use Inertia\Inertia;

/**
 * Class KalkulatorController
 *
 * @package App\Http\Controllers
 * Controller untuk mengelola permintaan terkait kalkulator zakat.
 * Bertanggung jawab untuk menampilkan halaman kalkulator dan memproses perhitungan zakat.
 */
class KalkulatorController extends Controller
{
    /**
     * @var KalkulatorService
     */
    protected KalkulatorService $kalkulatorService;

    /**
     * KalkulatorController constructor.
     *
     * @param KalkulatorService $kalkulatorService
     */
    public function __construct(KalkulatorService $kalkulatorService)
    {
        $this->kalkulatorService = $kalkulatorService;
    }

    /**
     * Menampilkan halaman kalkulator zakat.
     * Mengambil data yang diperlukan melalui KalkulatorService.
     *
     * @return \Inertia\Response
     */
    public function index(): \Inertia\Response
    {
        $pageData = $this->kalkulatorService->getKalkulatorPageData();

        return Inertia::render('user/kalkulator/index', $pageData);
    }

    /**
     * Menghitung hasil zakat berdasarkan input pengguna.
     * Validasi dilakukan oleh HitungZakatRequest.
     * Logika perhitungan didelegasikan ke KalkulatorService.
     *
     * @param HitungZakatRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function hitung(HitungZakatRequest $request): \Illuminate\Http\JsonResponse
    {
        $result = $this->kalkulatorService->hitungZakat($request);

        return response()->json($result);
    }
}