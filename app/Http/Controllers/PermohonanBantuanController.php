<?php

namespace App\Http\Controllers;

use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PermohonanBantuanController extends Controller
{
    /**
     * Menampilkan formulir pendaftaran jika ada periode aktif.
     */
    public function create()
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();

        // PERUBAHAN: Path disesuaikan menjadi 'user/permohonan/create'
        return Inertia::render('user/permohonan/create', [
            'activePeriode' => $activePeriode,
        ]);
    }

    /**
     * Menyimpan data permohonan baru.
     */
    public function store(Request $request)
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();
        if (!$activePeriode) {
            return back()->with('error', 'Saat ini tidak ada periode pendaftaran yang dibuka.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|size:16',
            'kk_number' => 'required|string|size:16',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_kk' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_khs' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        try {
            DB::beginTransaction();

            // Simpan foto profil terlebih dahulu
            $photoPath = $request->file('photo')->store('mustahiks', 'public');
            $mustahik = Mustahik::updateOrCreate(
                ['nik' => $validated['nik']],
                [
                    'name' => $validated['name'],
                    'kk_number' => $validated['kk_number'],
                    'phone_number' => $validated['phone_number'],
                    'address' => $validated['address'],
                    'photo' => $photoPath,
                ],
            );

            $existingPermohonan = Permohonan::where('mustahik_id', $mustahik->id)->where('periode_id', $activePeriode->id)->exists();

            if ($existingPermohonan) {
                return back()
                    ->withErrors(['nik' => 'Anda sudah terdaftar pada periode bantuan ini.'])
                    ->withInput();
            }

            $paths = [];
            foreach (['file_ktp', 'file_kk', 'file_khs'] as $fileKey) {
                if ($request->hasFile($fileKey)) {
                    $paths[$fileKey] = $request->file($fileKey)->store("permohonan_files/{$mustahik->id}", 'public');
                }
            }

            $uniqueCode = 'UPZ-' . time() . Str::upper(Str::random(4));

            Permohonan::create([
                'mustahik_id' => $mustahik->id,
                'periode_id' => $activePeriode->id,
                'unique_code' => $uniqueCode,
                'status' => 'Baru',
                'file_ktp' => $paths['file_ktp'] ?? null,
                'file_kk' => $paths['file_kk'] ?? null,
                'file_khs' => $paths['file_khs'] ?? null,
            ]);

            DB::commit();

            return redirect()->route('permohonan.success')->with('unique_code', $uniqueCode);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan pada sistem. Silakan coba lagi.');
        }
    }

    /**
     * Menampilkan halaman sukses setelah pendaftaran.
     */
    public function success()
    {
        if (!session('unique_code')) {
            return redirect()->route('home');
        }

        // PERUBAHAN: Path disesuaikan menjadi 'user/permohonan/success'
        return Inertia::render('user/permohonan/success', [
            'unique_code' => session('unique_code'),
        ]);
    }
}
