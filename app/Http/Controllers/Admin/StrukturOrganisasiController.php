<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    /**
     * Menampilkan halaman untuk mengedit data struktur organisasi.
     */
    public function edit()
    {
        // Ambil baris pertama (satu-satunya) dari data struktur
        $dataStruktur = StrukturOrganisasi::first();

        // Tambahkan URL gambar yang bisa diakses publik jika datanya ada
        if ($dataStruktur) {
            $dataStruktur->gambar_url = Storage::url($dataStruktur->gambar_path);
        }

        return Inertia::render('admin/struktur-organisasi/edit', [
            'dataStruktur' => $dataStruktur
        ]);
    }

    /**
     * Menyimpan atau memperbarui data struktur organisasi.
     */
    public function update(Request $request)
    {
        $request->validate([
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'keterangan' => 'nullable|string',
        ]);

        // Cari data yang sudah ada, atau buat instance baru jika belum ada
        $dataStruktur = StrukturOrganisasi::firstOrNew();

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($dataStruktur->gambar_path) {
                Storage::disk('public')->delete($dataStruktur->gambar_path);
            }
            // Simpan gambar baru
            $dataStruktur->gambar_path = $request->file('gambar')->store('struktur-organisasi', 'public');
        }

        $dataStruktur->keterangan = $request->input('keterangan');
        $dataStruktur->save();

        return redirect()->back()->with('success', 'Struktur organisasi berhasil diperbarui.');
    }
}
