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
    public function index()
    {
        $mustahiks = Mustahik::latest()->paginate(10);
        return Inertia::render('admin/mustahiks/index', [
            'mustahiks' => $mustahiks,
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // Gunakan Rule::unique untuk validasi yang lebih bersih
            'nik' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahik->id)],
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'kk_number' => 'required|string|size:16',
            // 'photo' dibuat nullable, tidak required
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Handle penghapusan foto jika foto baru tidak ada DAN user meminta hapus
        if ($request->input('remove_photo') && !$request->hasFile('photo')) {
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
                $validated['photo'] = null;
            }
        }

        // Handle upload foto baru
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }
            $validated['photo'] = $request->file('photo')->store('mustahiks', 'public');
        }

        $mustahik->update($validated);

        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil diperbarui.');
    }

    // Menghapus data mustahik dari database
    public function destroy(Mustahik $mustahik)
    {
        $mustahik->delete();
        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil dihapus.');
    }
}
