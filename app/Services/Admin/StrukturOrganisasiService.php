<?php

namespace App\Services\Admin;

use App\Repositories\Admin\StrukturOrganisasiRepository;
use App\Http\Requests\Admin\UpdateStrukturOrganisasiRequest;
use Illuminate\Support\Facades\Storage;

class StrukturOrganisasiService
{
    protected $repository;

    public function __construct(StrukturOrganisasiRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Mendapatkan data struktur untuk halaman edit.
     */
    public function getForEdit()
    {
        $dataStruktur = $this->repository->getFirst();

        if ($dataStruktur) {
            $dataStruktur->gambar_url = Storage::url($dataStruktur->gambar_path);
        }

        return $dataStruktur;
    }

    /**
     * Memperbarui data struktur organisasi.
     */
    public function update(UpdateStrukturOrganisasiRequest $request)
    {
        $dataStruktur = $this->repository->firstOrNew();
        $validatedData = $request->validated();

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($dataStruktur->gambar_path) {
                Storage::disk('public')->delete($dataStruktur->gambar_path);
            }
            // Simpan gambar baru
            $dataStruktur->gambar_path = $request->file('gambar')->store('struktur-organisasi', 'public');
        }

        $dataStruktur->keterangan = $validatedData['keterangan'] ?? '';

        return $this->repository->save($dataStruktur);
    }
}
