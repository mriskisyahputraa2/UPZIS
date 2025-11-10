<?php

namespace App\Repositories\Admin;

use App\Models\StrukturOrganisasi;
use Illuminate\Database\Eloquent\Model;

class StrukturOrganisasiRepository
{
    /**
     * Mengambil data struktur organisasi, atau membuat instance baru jika tidak ada.
     */
    public function firstOrNew(): Model|StrukturOrganisasi
    {
        return StrukturOrganisasi::firstOrNew();
    }

    /**
     * Menyimpan data struktur organisasi.
     */
    public function save(StrukturOrganisasi $dataStruktur): StrukturOrganisasi
    {
        $dataStruktur->save();
        return $dataStruktur;
    }

    /**
     * Mengambil data struktur organisasi yang pertama.
     */
    public function getFirst(): Model|StrukturOrganisasi|null
    {
        return StrukturOrganisasi::first();
    }
}
