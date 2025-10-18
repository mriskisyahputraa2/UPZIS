<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Menampilkan halaman profil utama pengguna,
     * lengkap dengan riwayat transaksi yang dipaginasi.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $validViews = ['profile', 'password', 'history'];
        $activeView = in_array($request->query('view', 'profile'), $validViews)
            ? $request->query('view', 'profile')
            : 'profile';

        return Inertia::render('user/muzakki/profile/index', [
            'transactions' => Transaksi::where('user_id', $user->id)
                ->latest()
                ->paginate(3)
                ->withQueryString(),
            'status' => session('status'),
            'activeView' => $activeView,
        ]);
    }

    /**
     * Memperbarui data nama pengguna.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        $user->name = $validated['name'];

        if ($request->hasFile('photo')) {
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }

            $path = $request->file('photo')->store('photos_profile', 'public');
            $user->photo = $path;
        }

        $user->save();

        return redirect()->route('profile.edit', ['view' => 'profile'])->with('status', 'profile-updated');
    }

    /**
     * Memperbarui password pengguna.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('profile.edit', ['view' => 'password'])->with('status', 'password-updated');
    }
}
