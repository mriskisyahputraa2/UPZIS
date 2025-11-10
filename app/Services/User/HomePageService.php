<?php

namespace App\Services\User;

use App\Repositories\User\HomePageRepository;

/**
 * Class HomePageService
 *
 * Service ini bertugas untuk mengelola logika bisnis
 * yang terkait dengan halaman beranda.
 *
 * @package App\Services\User
 */
class HomePageService
{
    /**
     * @var HomePageRepository
     */
    protected $homePageRepository;

    /**
     * HomePageService constructor.
     *
     * Menginjeksikan dependency HomePageRepository.
     *
     * @param HomePageRepository $homePageRepository
     */
    public function __construct(HomePageRepository $homePageRepository)
    {
        $this->homePageRepository = $homePageRepository;
    }

    /**
     * Menyiapkan dan mengumpulkan semua data yang dibutuhkan untuk halaman beranda.
     *
     * Metode ini memanggil repository untuk mendapatkan data mentah,
     * kemudian menyusunnya dalam format array yang siap digunakan oleh controller.
     *
     * @return array Data yang akan dikirim ke view.
     */
    public function getHomePageData(): array
    {
        $muzakkiCount = $this->homePageRepository->getMuzakkiCount();
        $mustahikCount = $this->homePageRepository->getMustahikCount();
        $programs = $this->homePageRepository->getLatestPublishedPrograms(3);

        return [
            'muzakkiCount' => $muzakkiCount,
            'mustahikCount' => $mustahikCount,
            'programs' => $programs,
        ];
    }
}
