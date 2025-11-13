<?php

namespace App\Services\Admin;

use App\Models\JenisZakat;
use App\Repositories\Admin\ZakatTypeRepository;

/**
 * Class ZakatTypeService
 *
 * Service ini menangani logika bisnis yang terkait dengan pengelolaan jenis zakat.
 * Saat ini berfungsi sebagai lapisan perantara ke repository.
 */
class ZakatTypeService
{
    /**
     * @var ZakatTypeRepository
     */
    protected $zakatTypeRepository;

    /**
     * ZakatTypeService constructor.
     *
     * @param  ZakatTypeRepository  $zakatTypeRepository
     */
    public function __construct(ZakatTypeRepository $zakatTypeRepository)
    {
        $this->zakatTypeRepository = $zakatTypeRepository;
    }

    /**
     * Membuat jenis zakat baru.
     *
     * @param  array  $data
     * @return JenisZakat
     */
    public function createZakatType(array $data): JenisZakat
    {
        return $this->zakatTypeRepository->create($data);
    }

    /**
     * Memperbarui data jenis zakat.
     *
     * @param  JenisZakat  $zakatType
     * @param  array  $data
     * @return bool
     */
    public function updateZakatType(JenisZakat $zakatType, array $data): bool
    {
        return $this->zakatTypeRepository->update($zakatType, $data);
    }

    /**
     * Menghapus jenis zakat.
     *
     * @param  JenisZakat  $zakatType
     * @return bool|null
     */
    public function deleteZakatType(JenisZakat $zakatType): ?bool
    {
        return $this->zakatTypeRepository->delete($zakatType);
    }
}
