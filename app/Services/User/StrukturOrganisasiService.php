<?php

namespace App\Services\User;

use App\Repositories\User\StrukturOrganisasiRepository;
use Illuminate\Support\Facades\Storage;

class StrukturOrganisasiService
{
    protected $repository;

    public function __construct(StrukturOrganisasiRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Mendapatkan data struktur untuk tampilan publik.
     */
    public function getForPublicView()
    {
        $dataStruktur = $this->repository->getFirst();

        if ($dataStruktur) {
            $dataStruktur->gambar_url = Storage::url($dataStruktur->gambar_path);
            return $dataStruktur;
        }

        // Buat objek default jika tabel masih kosong
        return (object) [
            'gambar_url' => null,
            'keterangan' => 'Informasi struktur organisasi belum tersedia.',
        ];
    }
}
