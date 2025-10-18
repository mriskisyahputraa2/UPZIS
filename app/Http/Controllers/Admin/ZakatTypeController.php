<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisZakat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ZakatTypeController extends Controller
{
    /**
     * Menampilkan daftar jenis zakat.
     */
    public function index(Request $request)
    {
        // 1. Validasi input filter
        $request->validate([
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|in:5,10,20,50',
        ]);

        // 2. Ambil nilai filter dari request
        $search = $request->input('search');
        $perPage = $request->input('per_page', 5); // Default 5 data per halaman

        // 3. Buat query ke database dengan filter
        $zakatTypes = JenisZakat::query() // Ganti ZakatType dengan nama model Anda
            ->when($search, function ($query, $search) {
                // Cari berdasarkan nama zakat
                return $query->where('name', 'like', "%{$search}%");
            })
            ->latest() // Urutkan berdasarkan yang terbaru
            ->paginate($perPage)
            ->withQueryString(); // Agar filter tetap ada di URL pagination

        // 4. Kirim data ke view Inertia
        return Inertia::render('admin/settings/zakat-types/index', [
            'zakatTypes' => $zakatTypes,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Menampilkan form untuk membuat jenis zakat baru.
     */
    public function create()
    {
        return Inertia::render('admin/settings/zakat-types/create');
    }

    /**
     * Menyimpan jenis zakat baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:jenis_zakat,name',
            'description' => 'required|string',
            'rate_percent' => 'required|numeric|min:0|max:100',
            'nisab_basis' => 'required|string|in:emas,perak,beras,uang',
            'nisab_quantity' => 'required|numeric|min:0',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        JenisZakat::create($validated);

        return Redirect::route('admin.settings.zakat-types.index')->with('success', 'Jenis zakat berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit jenis zakat.
     */
    public function edit(JenisZakat $zakat_type) // Route Model Binding
    {
        return Inertia::render('admin/settings/zakat-types/edit', [
            'jenisZakat' => $zakat_type
        ]);
    }

    /**
     * Memperbarui jenis zakat di database.
     */
    public function update(Request $request, JenisZakat $zakat_type)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:jenis_zakat,name,' . $zakat_type->id,
            'description' => 'required|string',
            'rate_percent' => 'required|numeric|min:0|max:100',
            'nisab_basis' => 'required|string|in:emas,perak,beras,uang',
            'nisab_quantity' => 'required|numeric|min:0',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        $zakat_type->update($validated);

        return Redirect::route('admin.settings.zakat-types.index')->with('success', 'Jenis zakat berhasil diperbarui.');
    }

    /**
     * Menghapus jenis zakat dari database.
     */
    public function destroy(JenisZakat $zakat_type)
    {
        $zakat_type->delete();

        return Redirect::back()->with('success', 'Jenis zakat berhasil dihapus.');
    }
}
