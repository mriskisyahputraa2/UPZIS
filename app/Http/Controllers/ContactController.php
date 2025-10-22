<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Menampilkan halaman form kontak.
     */
    public function index()
    {
        return Inertia::render('user/contact/index');
    }

    /**
     * Menyimpan pesan baru dari pengunjung.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10',
        ]);

        Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'status' => 'Baru', // Status default saat pesan pertama kali masuk
        ]);

        return Redirect::back()->with('success', 'Pesan Anda telah terkirim. Terima kasih telah menghubungi kami.');
    }
}
