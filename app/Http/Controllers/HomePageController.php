<?php

namespace App\Http\Controllers;

use App\Services\User\HomePageService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class HomePageController
 *
 * Controller ini menangani logika untuk menampilkan halaman utama (beranda)
 * kepada pengguna.
 *
 * @package App\Http\Controllers
 */
class HomePageController extends Controller
{
    /**
     * @var HomePageService
     */
    protected $homePageService;

    /**
     * HomePageController constructor.
     *
     * Menginjeksikan dependency HomePageService ke dalam controller.
     *
     * @param HomePageService $homePageService
     */
    public function __construct(HomePageService $homePageService)
    {
        $this->homePageService = $homePageService;
    }

    /**
     * Menampilkan halaman beranda.
     *
     * Mengambil data statistik dan program terbaru dari service
     * dan menampilkannya menggunakan Inertia.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $homePageData = $this->homePageService->getHomePageData();

        return Inertia::render('user/home/homepage', $homePageData);
    }
}
