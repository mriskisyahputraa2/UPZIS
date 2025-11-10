<?php

namespace App\Http\Controllers;

use App\Services\User\StrukturOrganisasiService;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    protected $service;

    public function __construct(StrukturOrganisasiService $service)
    {
        $this->service = $service;
    }

    /**
     * Menampilkan halaman struktur organisasi untuk publik.
     */
    public function index()
    {
        $dataStruktur = $this->service->getForPublicView();

        return Inertia::render('user/struktur-organisasi/index', [
            'dataStruktur' => $dataStruktur,
        ]);
    }
}
