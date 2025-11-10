<?php

namespace App\Repositories\User;

use App\Models\Program;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Class GaleriRepository
 *
 * Repositori ini bertanggung jawab untuk mengambil data program
 * dari database untuk ditampilkan di halaman galeri.
 *
 * @package App\Repositories\User
 */
class GaleriRepository
{
    /**
     * Mengambil semua program yang statusnya 'Published' dengan paginasi.
     *
     * Data yang diambil juga mencakup total dana penyaluran dan relasi foto,
     * diurutkan berdasarkan tanggal program terbaru.
     *
     * @param int $perPage Jumlah program per halaman.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPublishedProgramsPaginated(int $perPage = 9): LengthAwarePaginator
    {
        return Program::where('status', 'Published')
            ->withSum('penyalurans', 'amount')
            ->with('photos')
            ->latest('program_date')
            ->paginate($perPage);
    }

    /**
     * Mengambil detail sebuah program jika statusnya 'Published'.
     *
     * Jika program tidak ditemukan atau statusnya bukan 'Published',
     * fungsi ini akan mengembalikan null. Jika ditemukan, akan memuat
     * relasi 'photos', total dana, dan jumlah penyaluran.
     *
     * @param Program $program Instance program dari route model binding.
     * @return Program|null
     */
    public function getProgramDetails(Program $program): ?Program
    {
        if ($program->status !== 'Published') {
            return null;
        }

        // Muat relasi dan agregat yang dibutuhkan
        $program->load('photos');
        $program->loadSum('penyalurans', 'amount');
        $program->loadCount('penyalurans');

        return $program;
    }
}
