<?php

namespace App\Repositories\User;

use App\Models\JenisZakat;
use App\Models\Setting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Class KalkulatorRepository
 *
 * @package App\Repositories\User
 * Repositori untuk mengelola akses data terkait kalkulator zakat.
 */
class KalkulatorRepository
{
    /**
     * Mengambil semua jenis zakat yang berstatus 'Aktif'.
     *
     * @return Collection<int, JenisZakat>
     */
    public function getAktifJenisZakat(): Collection
    {
        return JenisZakat::where('status', 'Aktif')->get();
    }

    /**
     * Mengambil harga emas per gram dari pengaturan aplikasi.
     * Hasilnya di-cache selama 60 menit untuk performa.
     *
     * @return float
     */
    public function getHargaEmas(): float
    {
        return (float) Cache::remember('harga_emas_per_gram', 60, function () {
            return Setting::where('setting_key', 'harga_emas_per_gram')->value('setting_value');
        });
    }

    /**
     * Mencari JenisZakat berdasarkan ID.
     *
     * @param int $id
     * @return JenisZakat|null
     */
    public function findJenisZakat(int $id): ?JenisZakat
    {
        return JenisZakat::find($id);
    }
}
