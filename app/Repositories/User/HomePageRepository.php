<?php

namespace App\Repositories\User;

use App\Models\Permohonan;
use App\Models\Program;
use App\Models\Transaksi;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class HomePageRepository
 *
 * Repositori ini bertanggung jawab untuk mengambil data dari database
 * yang terkait dengan halaman beranda.
 *
 * @package App\Repositories\User
 */
class HomePageRepository
{
    /**
     * Menghitung jumlah muzakki unik yang telah berhasil melakukan transaksi.
     * Muzakki dihitung berdasarkan user_id yang berbeda.
     *
     * @return int Jumlah muzakki.
     */
    public function getMuzakkiCount(): int
    {
        return Transaksi::where('status', 'Berhasil')->distinct('user_id')->count('user_id');
    }

    /**
     * Menghitung jumlah mustahik yang permohonannya telah disetujui.
     *
     * @return int Jumlah mustahik.
     */
    public function getMustahikCount(): int
    {
        return Permohonan::where('status', 'Disetujui')->count();
    }

    /**
     * Mengambil program-program terbaru yang statusnya sudah 'Published'.
     *
     * Fungsi ini juga mengambil total dana yang terkumpul untuk setiap program
     * dan foto-foto terkait program tersebut.
     *
     * @param int $limit Jumlah program yang ingin diambil.
     * @return \Illuminate\Database\Eloquent\Collection Kumpulan data program.
     */
    public function getLatestPublishedPrograms(int $limit = 3): Collection
    {
        return Program::where('status', 'Published')
            ->withSum('penyalurans', 'amount') // Hitung total dana dari relasi penyalurans
            ->with('photos') // Ambil relasi foto
            ->latest('program_date') // Urutkan berdasarkan tanggal program terbaru
            ->take($limit) // Ambil sejumlah data sesuai limit
            ->get();
    }
}
