<?php

namespace App\Http\Controllers;

use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule; // <-- 1. TAMBAHKAN IMPORT INI

class PermohonanBantuanController extends Controller
{
    public function create()
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();

        return Inertia::render('user/permohonan/create', [
            'activePeriode' => $activePeriode,
        ]);
    }

    // ## GANTI SELURUH METHOD STORE ANDA DENGAN INI ##
    public function store(Request $request)
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();
        if (!$activePeriode) {
            return back()->with('error', 'Saat ini tidak ada periode pendaftaran yang dibuka.');
        }

        // Langkah 1: Validasi format dasar
        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
                'nik' => 'required|string|size:16',
                'kk_number' => 'required|string|size:16',
                'phone_number' => 'required|string|max:20',
                'address' => 'required|string',
                'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
                'file_ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'file_kk' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'file_khs' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'file_surat_fakir_miskin' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'file_tidak_menerima_beasiswa' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'file_surat_permohonan' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ],
            [
                // Pesan kustom untuk setiap aturan validasi
                'photo.required' => 'Foto profil wajib diunggah.',
                'photo.image' => 'File yang diunggah harus berupa gambar.',
                'photo.mimes' => 'Format foto harus jpg, jpeg, atau png.',
                'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
                'name.required' => 'Kolom Nama Lengkap wajib diisi.',
                'nik.required' => 'Kolom NIK wajib diisi.',
                'kk_number.required' => 'Kolom No. KK wajib diisi.',
                'phone_number.required' => 'Kolom No. Telepon wajib diisi.',
                'address.required' => 'Kolom Alamat wajib diisi.',
                'file_ktp.required' => 'Kolom KTP wajib diisi ',
                'file_kk.required' => 'Kolom KK wajib diisi ',
                'file_khs.required' => 'Kolom KHS wajib diisi ',
                'file_ktp.mimes' => 'Format file harus jpg, jpeg, png dan pdf',
                'file_kk.mimes' => 'Format file harus jpg, jpeg, png dan pdf',
                'file_khs.mimes' => 'Format file harus jpg, jpeg, png dan pdf',
                'phone_number.max' => 'Kolom No. Telepon maksimal 20 karakter.',
                'kk_number.size' => 'Kolom KK harus 16 karakter',
                'nik.size' => 'Kolom NIK harus 16 karakter',
                'file_surat_fakir_miskin.required' => 'Surat Keterangan Fakir/Miskin wajib diunggah.',
                'file_tidak_menerima_beasiswa.required' => 'Surat Keterangan Tidak Menerima Beasiswa wajib diunggah.',
                'file_surat_permohonan.required' => 'Surat Permohonan wajib diunggah.',
            ],
        );

        // Langkah 2: Lakukan semua pengecekan duplikasi secara manual
        $customErrors = [];
        $mustahikByNik = Mustahik::where('nik', $validated['nik'])->first();
        $mustahikByKk = Mustahik::where('kk_number', $validated['kk_number'])->first();

        // Cek #1: Apakah NIK sudah mendaftar di periode ini?
        if ($mustahikByNik) {
            $existingPermohonan = Permohonan::where('mustahik_id', $mustahikByNik->id)->where('periode_id', $activePeriode->id)->exists();
            if ($existingPermohonan) {
                $customErrors['nik'] = 'NIK Anda sudah terdaftar pada periode bantuan ini.';
            }
        }

        // Cek #2: Apakah No. KK sudah digunakan oleh NIK yang berbeda?
        if ($mustahikByKk && (!$mustahikByNik || $mustahikByNik->id !== $mustahikByKk->id)) {
            $customErrors['kk_number'] = 'No. KK ini sudah terdaftar untuk NIK yang berbeda.';
        }

        // Langkah 3: Jika ada error terkumpul, kirim semuanya sekaligus
        if (!empty($customErrors)) {
            return back()->withErrors($customErrors)->withInput();
        }

        // Langkah 4: Jika tidak ada error, lanjutkan proses
        try {
            DB::beginTransaction();

            $photoPath = $request->file('photo')->store('mustahik-photos', 'public');

            $mustahik = Mustahik::updateOrCreate(
                ['nik' => $validated['nik']],
                [
                    'name' => $validated['name'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'kk_number' => $validated['kk_number'],
                    'phone_number' => $validated['phone_number'],
                    'address' => $validated['address'],
                    'photo' => $photoPath,
                ],
            );

            $paths = [];
            $fileKeys = ['file_ktp', 'file_kk', 'file_khs', 'file_surat_fakir_miskin', 'file_tidak_menerima_beasiswa', 'file_surat_permohonan'];
            foreach ($fileKeys as $fileKey) {
                if ($request->hasFile($fileKey)) {
                    $paths[$fileKey] = $request->file($fileKey)->store("permohonan_files/{$mustahik->id}", 'public');
                }
            }

            $uniqueCode = 'UPZIS-' . time() . Str::upper(Str::random(4));

            Permohonan::create([
                'mustahik_id' => $mustahik->id,
                'periode_id' => $activePeriode->id,
                'unique_code' => $uniqueCode,
                'status' => 'Baru',
                'file_ktp' => $paths['file_ktp'] ?? null,
                'file_kk' => $paths['file_kk'] ?? null,
                'file_khs' => $paths['file_khs'] ?? null,
                'file_surat_fakir_miskin' => $paths['file_surat_fakir_miskin'] ?? null,
                'file_tidak_menerima_beasiswa' => $paths['file_tidak_menerima_beasiswa'] ?? null,
                'file_surat_permohonan' => $paths['file_surat_permohonan'] ?? null,
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

        return Inertia::render('user/permohonan/success', [
            'unique_code' => session('unique_code'),
        ]);
    }

    /**
     * Menampilkan halaman dan hasil pelacakan status permohonan.
     */
    public function lacak(Request $request)
    {
        // Validasi semua kemungkinan input
        $validated = $request->validate([
            'kode' => 'nullable|string|max:255',
            'identifier' => 'nullable|string|max:255', // <-- Menggantikan nik & phone_number
        ]);

        $permohonan = null;

        if ($request->filled('kode')) {
            // ALUR 1: Lacak dengan KODE UNIK
            $permohonan = Permohonan::where('unique_code', $validated['kode'])
                ->with(['mustahik', 'periode'])
                ->first();
        } elseif ($request->filled('identifier')) {
            // ALUR 2: Lacak dengan NIK atau NO. TELEPON

            $identifier = $validated['identifier'];

            // 1. Cari mustahik yang NIK atau No. HP-nya cocok
            $mustahik = Mustahik::where('nik', $identifier)->orWhere('phone_number', $identifier)->first();

            // 2. Jika ditemukan, cari permohonan TERBARU miliknya
            if ($mustahik) {
                $permohonan = Permohonan::where('mustahik_id', $mustahik->id)
                    ->with(['mustahik', 'periode'])
                    ->latest() // Mengambil permohonan yang paling baru
                    ->first();
            }
        }

        return Inertia::render('user/permohonan/lacak', [
            'permohonan' => $permohonan,
            'filters' => $validated,
        ]);
    }
}
