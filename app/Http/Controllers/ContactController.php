<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ContactStoreRequest;
use App\Services\User\ContactService;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * @var ContactService
     */
    protected $contactService;

    /**
     * ContactController constructor.
     *
     * @param  ContactService  $contactService
     */
    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    /**
     * Menampilkan halaman form kontak.
     *
     * Halaman ini berfungsi sebagai antarmuka bagi pengunjung untuk mengirimkan
     * pesan, pertanyaan, atau umpan balik kepada pihak UPZIS.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('user/contact/index');
    }

    /**
     * Menyimpan pesan baru dari pengunjung.
     *
     * Metode ini akan memvalidasi data yang masuk melalui ContactStoreRequest.
     * Jika validasi berhasil, data akan diproses oleh ContactService untuk
     * disimpan ke dalam database. Status default untuk setiap pesan baru
     * adalah 'Baru'.
     *
     * @param  ContactStoreRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ContactStoreRequest $request)
    {
        $data = $request->validated();
        $data['status'] = 'Baru'; // Status default saat pesan pertama kali masuk

        $this->contactService->createContact($data);

        return Redirect::back()->with('success', 'Pesan Anda telah terkirim. Terima kasih telah menghubungi kami.');
    }
}
