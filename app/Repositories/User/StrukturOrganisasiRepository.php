<?php

namespace App\Repositories\User;

use App\Models\StrukturOrganisasi;
use Illuminate\Database\Eloquent\Model;

class StrukturOrganisasiRepository
{
    /**
     * Mengambil data struktur organisasi yang pertama.
     */
    public function getFirst(): Model|StrukturOrganisasi|null
    {
        return StrukturOrganisasi::first();
    }
}
