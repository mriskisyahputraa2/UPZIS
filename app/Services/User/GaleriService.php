<?php

namespace App\Services\User;

use App\Models\Program;
use App\Repositories\User\GaleriRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Class GaleriService
 *
 * Service ini mengelola logika bisnis untuk fitur galeri program.
 *
 * @package App\Services\User
 */
class GaleriService
{
    /**
     * @var GaleriRepository
     */
    protected $galeriRepository;

    /**
     * GaleriService constructor.
     *
     * @param GaleriRepository $galeriRepository
     */
    public function __construct(GaleriRepository $galeriRepository)
    {
        $this->galeriRepository = $galeriRepository;
    }

    /**
     * Mendapatkan daftar program yang sudah dipublikasikan untuk halaman indeks galeri.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getProgramsForIndex(): LengthAwarePaginator
    {
        return $this->galeriRepository->getPublishedProgramsPaginated(9);
    }

    /**
     * Mendapatkan detail program untuk halaman show.
     *
     * Metode ini akan mengembalikan null jika program tidak dapat diakses
     * (misalnya, statusnya bukan 'Published').
     *
     * @param Program $program
     * @return Program|null
     */
    public function getProgramForShow(Program $program): ?Program
    {
        return $this->galeriRepository->getProgramDetails($program);
    }
}
