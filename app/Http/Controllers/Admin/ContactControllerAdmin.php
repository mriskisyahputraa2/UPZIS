<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContactIndexRequest; // Gunakan Request yang baru
use App\Models\Contact;
use App\Repositories\Admin\AdminContactRepository; // Import Repository
use App\Services\Admin\AdminContactService; // Import Service
use Inertia\Inertia;

class ContactControllerAdmin extends Controller
{
    // Lakukan dependency injection untuk Repository dan Service
    public function __construct(
        protected AdminContactRepository $contactRepository,
        protected AdminContactService $contactService
    ) {}

    /**
     * Menampilkan daftar semua pesan masuk.
     */
    public function index(ContactIndexRequest $request)
    {
        // 1. Validasi sudah otomatis dijalankan oleh ContactIndexRequest.
        // 2. Minta data dari Repository.
        $contacts = $this->contactRepository->getPaginatedContacts($request);

        return Inertia::render('admin/contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->validated(), // Kirim data yang sudah divalidasi
        ]);
    }

    /**
     * Menampilkan detail satu pesan.
     */
    public function show(Contact $kontak)
    {
        // 1. Jalankan logika bisnis melalui Service.
        $this->contactService->markAsRead($kontak);

        // 2. Lakukan format tanggal (logika presentasi).
        $kontak->formatted_date = $kontak->created_at
            ? $kontak->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y, H:i')
            : 'Tanggal tidak tersedia';

        return Inertia::render('admin/contacts/show', [
            'contact' => $kontak,
        ]);
    }

    /**
     * Menghapus satu pesan.
     */
    public function destroy(Contact $kontak)
    {
        // Jalankan logika penghapusan melalui Service.
        $this->contactService->deleteContact($kontak);

        return redirect()->route('admin.kontak.index')->with('success', 'Pesan berhasil dihapus.');
    }
}
