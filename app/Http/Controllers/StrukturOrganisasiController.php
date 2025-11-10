<?php

namespace App\Http\Controllers;

use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    /**
     * Menampilkan halaman struktur organisasi untuk publik.
     */
    public function index()
    {
        // Ambil baris pertama dari tabel
        $dataStruktur = StrukturOrganisasi::first();

        // Tambahkan URL gambar yang bisa diakses publik jika datanya ada
        if ($dataStruktur) {
            $dataStruktur->gambar_url = Storage::url($dataStruktur->gambar_path);
        } else {
            // Buat objek default jika tabel masih kosong
            $dataStruktur = (object) [
                'gambar_url' => null,
                'keterangan' => 'Informasi struktur organisasi belum tersedia.',
            ];
        }

        return Inertia::render('user/struktur-organisasi/index', [
            'dataStruktur' => $dataStruktur,
        ]);
    }
}
