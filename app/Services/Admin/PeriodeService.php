<?php

namespace App\Services\Admin;

use App\Models\Periode;
use App\Repositories\Admin\PeriodeRepository;
use Exception;
use Illuminate\Support\Facades\DB;

/**
 * Class PeriodeService
 *
 * Service ini menangani logika bisnis yang terkait dengan pengelolaan periode.
 */
class PeriodeService
{
    /**
     * @var PeriodeRepository
     */
    protected $periodeRepository;

    /**
     * PeriodeService constructor.
     *
     * @param  PeriodeRepository  $periodeRepository
     */
    public function __construct(PeriodeRepository $periodeRepository)
    {
        $this->periodeRepository = $periodeRepository;
    }

    /**
     * Membuat periode baru dan menangani aturan bisnis terkait status.
     *
     * @param  array  $data
     * @return Periode
     *
     * @throws Exception
     */
    public function createPeriode(array $data): Periode
    {
        DB::beginTransaction();
        try {
            // Jika periode baru 'Aktif', nonaktifkan semua yang lain.
            if ($data['status'] === 'Aktif') {
                $this->periodeRepository->deactivateOthers();
            }

            $periode = $this->periodeRepository->create($data);

            DB::commit();

            return $periode;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Memperbarui periode dan menangani aturan bisnis terkait status.
     *
     * @param  Periode  $periode
     * @param  array  $data
     * @return bool
     *
     * @throws Exception
     */
    public function updatePeriode(Periode $periode, array $data): bool
    {
        DB::beginTransaction();
        try {
            // Jika periode ini diubah menjadi 'Aktif', nonaktifkan semua yang lain.
            if ($data['status'] === 'Aktif') {
                $this->periodeRepository->deactivateOthers($periode->id);
            }

            $result = $this->periodeRepository->update($periode, $data);

            DB::commit();

            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Menghapus periode dengan memeriksa aturan bisnis terlebih dahulu.
     *
     * @param  Periode  $periode
     * @return bool
     *
     * @throws Exception
     */
    public function deletePeriode(Periode $periode): bool
    {
        // Aturan Bisnis: Jangan hapus periode jika sudah ada permohonan terkait.
        if ($this->periodeRepository->hasPermohonan($periode)) {
            throw new Exception('Periode tidak dapat dihapus karena sudah memiliki data permohonan.');
        }

        return $this->periodeRepository->delete($periode);
    }
}
