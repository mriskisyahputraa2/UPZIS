<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactControllerAdmin extends Controller
{
    /**
     * Menampilkan daftar semua pesan masuk.
     */
    public function index(Request $request)
    {
        // Validasi input filter dari request
        $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Baru,Sudah Dibaca',
            'per_page' => 'nullable|integer|in:5,10,20,50',
        ]);

        $contacts = Contact::query()
            ->when($request->input('search'), function ($query, $search) {
                // Filter berdasarkan nama atau email pengirim
                $query->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                // Filter berdasarkan status
                $query->where('status', 'like', "%{$status}%");
            })
            ->latest() // Urutkan dari yang terbaru
            ->paginate($request->input('per_page', 5)) // Default paginasi diubah menjadi 5
            ->withQueryString();

        return Inertia::render('admin/contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    /**
     * Menampilkan detail satu pesan dan mengubah statusnya menjadi 'Sudah Dibaca'.
     */
    public function show(Contact $kontak)
    {
        if ($kontak->status === 'Baru') {
            $kontak->update(['status' => 'Sudah Dibaca']);
            $kontak->refresh();
        }

        $kontak->formatted_date = $kontak->created_at ? $kontak->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') : 'Tanggal tidak tersedia';

        return Inertia::render('admin/contacts/show', [
            'contact' => $kontak, // Kirim dengan nama 'contact' agar cocok dengan frontend
        ]);
    }

    /**
     * Menghapus satu pesan.
     */
    public function destroy(Contact $kontak)
    {
        $kontak->delete();
        return redirect()->route('admin.kontak.index')->with('success', 'Pesan berhasil dihapus.');
    }
}
