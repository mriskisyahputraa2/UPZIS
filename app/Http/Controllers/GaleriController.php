<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Services\User\GaleriService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class GaleriController
 *
 * Controller ini menangani request terkait halaman galeri program.
 *
 * @package App\Http\Controllers
 */
class GaleriController extends Controller
{
    /**
     * @var GaleriService
     */
    protected $galeriService;

    /**
     * GaleriController constructor.
     *
     * @param GaleriService $galeriService
     */
    public function __construct(GaleriService $galeriService)
    {
        $this->galeriService = $galeriService;
    }

    /**
     * Menampilkan halaman daftar semua program (galeri).
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $programs = $this->galeriService->getProgramsForIndex();

        return Inertia::render('user/galeri/index', [
            'programs' => $programs,
        ]);
    }

    /**
     * Menampilkan halaman detail dari satu program.
     *
     * Jika program tidak ditemukan atau belum di-publish,
     * akan menampilkan halaman 404.
     *
     * @param Program $program
     * @return \Inertia\Response
     */
    public function show(Program $program): Response
    {
        $programDetails = $this->galeriService->getProgramForShow($program);

        if (!$programDetails) {
            abort(404);
        }

        return Inertia::render('user/galeri/show', [
            'program' => $programDetails,
        ]);
    }
}
