<?php

namespace App\Services\User;

use App\Http\Requests\User\HitungZakatRequest;
use App\Models\JenisZakat;
use App\Repositories\User\KalkulatorRepository;
use Illuminate\Support\Collection;

/**
 * Class KalkulatorService
 *
 * @package App\Services\User
 * Layanan untuk mengelola logika bisnis terkait kalkulator zakat.
 */
class KalkulatorService
{
    /**
     * @var KalkulatorRepository
     */
    protected KalkulatorRepository $kalkulatorRepository;

    /**
     * KalkulatorService constructor.
     *
     * @param KalkulatorRepository $kalkulatorRepository
     */
    public function __construct(KalkulatorRepository $kalkulatorRepository)
    {
        $this->kalkulatorRepository = $kalkulatorRepository;
    }

    /**
     * Mengambil data yang diperlukan untuk halaman kalkulator zakat.
     *
     * @return array
     */
    public function getKalkulatorPageData(): array
    {
        $jenisZakat = $this->kalkulatorRepository->getAktifJenisZakat();
        $hargaEmas = $this->kalkulatorRepository->getHargaEmas();

        return [
            'jenisZakat' => $jenisZakat,
            'hargaEmas' => $hargaEmas,
        ];
    }

    /**
     * Menghitung hasil zakat berdasarkan input pengguna.
     *
     * @param HitungZakatRequest $request
     * @return array
     */
    public function hitungZakat(HitungZakatRequest $request): array
    {
        $jenisZakat = $this->kalkulatorRepository->findJenisZakat($request->jenis_zakat_id);
        $hargaEmas = $this->kalkulatorRepository->getHargaEmas();

        $nominalZakat = 0;
        $wajibZakat = false;
        $nisab = 0;
        $pendapatanBersih = 0;

        if (!$jenisZakat) {
            // Menangani kasus jika JenisZakat tidak ditemukan, meskipun validasi seharusnya mencegah ini.
            return [
                'nisab' => 0,
                'pendapatan_bersih' => 0,
                'wajib_zakat' => false,
                'nominal_zakat' => 0,
            ];
        }

        if (str_contains(strtolower($jenisZakat->name), 'profesi')) {
            // Logika perhitungan Zakat Profesi
            $pendapatanPokok = (float) $request->pendapatan_pokok;
            $pendapatanLain = (float) $request->pendapatan_lain;
            $hutangCicilan = (float) $request->hutang_cicilan;

            $pendapatanBersih = $pendapatanPokok + $pendapatanLain - $hutangCicilan;

            $nisabTahunan = $jenisZakat->nisab_quantity * $hargaEmas;
            $nisabBulanan = $nisabTahunan / 12;
            $nisab = $nisabBulanan;

            if ($pendapatanBersih >= $nisabBulanan) {
                $wajibZakat = true;
                $nominalZakat = ($jenisZakat->rate_percent / 100) * $pendapatanBersih;
            }
        } else {
            // Logika perhitungan Zakat Maal lainnya
            $nilaiHarta = (float) $request->pendapatan_pokok;
            $nisab = $jenisZakat->nisab_quantity * $hargaEmas; // Nisab tahunan
            $pendapatanBersih = $nilaiHarta;

            if ($nilaiHarta >= $nisab) {
                $wajibZakat = true;
                $nominalZakat = ($jenisZakat->rate_percent / 100) * $nilaiHarta;
            }
        }

        return [
            'nisab' => $nisab,
            'pendapatan_bersih' => $pendapatanBersih,
            'wajib_zakat' => $wajibZakat,
            'nominal_zakat' => $nominalZakat < 0 ? 0 : $nominalZakat,
        ];
    }
}
