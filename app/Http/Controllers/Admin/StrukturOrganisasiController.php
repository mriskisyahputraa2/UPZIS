<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateStrukturOrganisasiRequest;
use App\Services\Admin\StrukturOrganisasiService;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    protected $service;

    public function __construct(StrukturOrganisasiService $service)
    {
        $this->service = $service;
    }

    /**
     * Menampilkan halaman untuk mengedit data struktur organisasi.
     */
    public function edit()
    {
        $dataStruktur = $this->service->getForEdit();

        return Inertia::render('admin/struktur-organisasi/edit', [
            'dataStruktur' => $dataStruktur
        ]);
    }

    /**
     * Menyimpan atau memperbarui data struktur organisasi.
     */
    public function update(UpdateStrukturOrganisasiRequest $request)
    {
        $this->service->update($request);

        return redirect()->back()->with('success', 'Struktur organisasi berhasil diperbarui.');
    }
}
