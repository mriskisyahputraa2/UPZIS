<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Menampilkan daftar pengguna admin.
     */
    public function index(Request $request)
    {
        // 1. Validasi input filter dari request
        $request->validate([
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|in:5,10,20,50',
        ]);

        // 2. Ambil nilai filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 5);

        // 3. Buat query dengan filter
        $admins = User::query()
            ->where('role', 'admin')
            ->when($search, function ($query, $search) {
                // Cari berdasarkan nama atau email
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        // 4. Kirim data ke view
        return Inertia::render('admin/settings/admins/index', [
            'admins' => $admins,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Menampilkan form untuk membuat admin baru.
     */
    public function create()
    {
        return Inertia::render('admin/settings/admins/create');
    }

    /**
     * Menyimpan admin baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            // START: PERBAIKAN VALIDASI PASSWORD
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            // END: PERBAIKAN VALIDASI
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Dihandle oleh 'hashed' cast di Model
            'role' => 'admin',
        ]);

        return Redirect::route('admin.settings.admins.index')->with('success', 'Admin baru berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit data admin.
     */
    public function edit(User $admin)
    {
        return Inertia::render('admin/settings/admins/edit', [
            'admin' => $admin,
        ]);
    }

    /**
     * Memperbarui data admin di database.
     */
    public function update(Request $request, User $admin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class . ',email,' . $admin->id,
            // START: PERBAIKAN VALIDASI PASSWORD
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
            // END: PERBAIKAN VALIDASI
        ]);

        $admin->name = $request->name;
        $admin->email = $request->email;

        if ($request->filled('password')) {
            $admin->password = $request->password;
        }

        $admin->save();

        return Redirect::route('admin.settings.admins.index')->with('success', 'Data admin berhasil diperbarui.');
    }

    /**
     * Menghapus admin dari database.
     */
    public function destroy(User $admin)
    {
        if ($admin->id === auth()->id()) {
            return Redirect::back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $admin->delete();

        return Redirect::back()->with('success', 'Akun admin berhasil dihapus.');
    }
}
