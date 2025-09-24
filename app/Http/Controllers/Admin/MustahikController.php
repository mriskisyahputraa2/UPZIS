<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mustahik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MustahikController extends Controller
{
    // Menampilkan halaman daftar mustahik
    public function index(Request $request)
    {
        // Membangun query secara dinamis
        $mustahiks = Mustahik::query()
            ->when($request->input('search'), function ($query, $search) {
                // Mencari berdasarkan nama atau NIK
                $query->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
            })
            ->latest() // Mengurutkan dari yang terbaru
            ->paginate($request->input('per_page', 5))
            ->withQueryString(); // Memastikan filter tetap ada saat pindah halaman

        // Mengirim data ke frontend
        return Inertia::render('admin/mustahiks/index', [
            'mustahiks' => $mustahiks,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    // Menampilkan form untuk menambah mustahik baru
    public function create()
    {
        return Inertia::render('admin/mustahiks/create');
    }

    // Menyimpan data mustahik baru ke database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:mustahiks',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'kk_number' => 'required|string|size:16',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->all();

        // Handle upload foto
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('mustahiks', 'public');
            $data['photo'] = $photoPath;
        }

        Mustahik::create($data);

        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil ditambahkan.');
    }

    // Menampilkan form untuk mengedit data mustahik
    public function edit(Mustahik $mustahik)
    {
        return Inertia::render('admin/mustahiks/edit', [
            'mustahik' => $mustahik,
        ]);
    }

    // Memperbarui data mustahik di database

    public function update(Request $request, Mustahik $mustahik)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahik->id)],
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'kk_number' => 'required|string|size:16',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi untuk file baru
        ]);

        // Ambil semua data yang tervalidasi kecuali 'photo'
        $updateData = $request->except('photo', '_method');

        // Logika untuk menangani upload atau penghapusan foto
        if ($request->hasFile('photo')) {
            // Jika ada foto baru diupload
            // 1. Hapus foto lama dari storage
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }
            // 2. Simpan foto baru dan dapatkan path-nya
            $updateData['photo'] = $request->file('photo')->store('mustahiks', 'public');
        } elseif ($request->input('remove_photo')) {
            // Jika user secara eksplisit meminta menghapus foto (tanpa mengganti)
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }
            $updateData['photo'] = null;
        }
        // Jika tidak ada aksi terkait foto, jangan lakukan apa-apa, foto lama akan tetap ada.

        $mustahik->update($updateData);

        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil diperbarui.');
    }

    // Menghapus data mustahik dari database
    public function destroy(Mustahik $mustahik)
    {
        $mustahik->delete();
        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil dihapus.');
    }
}
