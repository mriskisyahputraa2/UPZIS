<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use App\Models\PermohonanDokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Penyaluran;
use App\Models\Setting;
use App\Models\Transaksi;

class MustahikController extends Controller
{
    // Menampilkan halaman daftar mustahik
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'periode_id' => 'nullable|integer|exists:periodes,id',
            'jenis_kelamin' => 'nullable|string|in:Laki-laki,Perempuan',
            'kategori_pemohon' => 'nullable|string|in:mahasiswa,umum',
        ]);

        $activePeriode = Periode::where('status', 'Aktif')->first();

        $mustahiksQuery = Mustahik::query()
            ->with('latestPermohonan')
            ->whereHas('permohonans', function ($query) {
                $query->where('status', 'Disetujui');
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->input('jenis_kelamin'), function ($query, $jenisKelamin) {
                $query->where('jenis_kelamin', $jenisKelamin);
            })
            ->when($request->input('kategori_pemohon'), function ($query, $kategori) {
                // Filter based on the latest permohonan
                $query->whereHas('latestPermohonan', function ($q) use ($kategori) {
                    $q->where('kategori_pemohon', $kategori);
                });
            })
            ->when($request->input('periode_id'), function ($query, $periode_id) {
                $query->whereHas('permohonans', function ($q) use ($periode_id) {
                    $q->where('periode_id', $periode_id);
                });
            })
            ->when(!$request->filled('periode_id') && $activePeriode, function ($query) use ($activePeriode) {
                $query->whereHas('permohonans', function ($q) use ($activePeriode) {
                    $q->where('periode_id', $activePeriode->id)->where('status', 'Disetujui');
                });
            });

        $mustahiks = $mustahiksQuery->distinct()->latest()->paginate($request->input('per_page', 5))->withQueryString();

        $periodes = Periode::latest()->get(['id', 'name']);

        $currentFilters = $request->only(['search', 'per_page', 'periode_id', 'jenis_kelamin', 'kategori_pemohon']);
        if (!$request->has('periode_id') && $activePeriode) {
            $currentFilters['periode_id'] = $activePeriode->id;
        }

        return Inertia::render('admin/mustahiks/index', [
            'mustahiks' => $mustahiks,
            'filters' => $currentFilters,
            'periodes' => $periodes,
            'activePeriode' => $activePeriode,
        ]);
    }
    // Menampilkan form untuk menambah mustahik baru
    public function create()
    {
        if (!Periode::where('status', 'Aktif')->exists()) {
            return redirect()->route('admin.mustahiks.index')->with('error', 'Tidak ada periode aktif. Silakan aktifkan satu periode untuk menambah data mustahik.');
        }
        return Inertia::render('admin/mustahiks/create');
    }

    // Menyimpan data mustahik baru ke database
    public function store(Request $request)
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();
        if (!$activePeriode) {
            return back()->with('error', 'Gagal menyimpan data karena tidak ada periode pendaftaran yang aktif.');
        }

        $isUmum = $request->input('kategori_pemohon') === 'umum';

        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
                'kategori_pemohon' => 'required|string|in:mahasiswa,umum',
                'nik' => 'required|string|size:16|unique:mustahiks,nik',
                'kk_number' => 'required|string|size:16|unique:mustahiks,kk_number',
                'phone_number' => 'required|string|max:20',
                'address' => 'required|string',
                'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                // Aturan yang benar: Wajib jika 'umum', dan boleh kosong (nullable) jika tidak.
                'pekerjaan' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'max:255'],
                'jumlah_tanggungan' => [Rule::requiredIf($isUmum), 'nullable', 'integer', 'min:0'],
                'status_rumah' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'in:Milik Sendiri,Sewa/Kontrak,Menumpang'],
                'file_sktm' => [Rule::requiredIf($isUmum), 'nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
                'file_rumah_depan' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
                'file_rumah_belakang' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
                'file_rumah_kiri' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
                'file_rumah_kanan' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
            ],
            [
                // Validasi Data Pribadi
                'name.required' => 'Nama lengkap wajib diisi.',
                'name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',
                'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
                'jenis_kelamin.in' => 'Pilihan jenis kelamin tidak valid.',
                'kategori_pemohon.required' => 'Kategori mustahik wajib dipilih.',
                'kategori_pemohon.in' => 'Pilihan kategori tidak valid.',
                'phone_number.required' => 'Nomor telepon wajib diisi.',
                'phone_number.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
                'address.required' => 'Alamat lengkap wajib diisi.',
                'photo.required' => 'Foto mustahik wajib diunggah.',
                'photo.image' => 'File yang diunggah untuk foto harus berupa gambar.',
                'photo.mimes' => 'Format foto harus berupa: jpeg, png, jpg.',
                'photo.max' => 'Ukuran file foto tidak boleh lebih dari 2MB.',

                // Validasi Data Kependudukan
                'nik.required' => 'NIK wajib diisi.',
                'nik.size' => 'NIK harus terdiri dari 16 digit angka.',
                'nik.unique' => 'NIK ini sudah terdaftar di sistem.',
                'kk_number.required' => 'Nomor KK wajib diisi.',
                'kk_number.size' => 'Nomor KK harus terdiri dari 16 digit angka.',
                'kk_number.unique' => 'Nomor KK ini sudah terdaftar di sistem.',

                // Validasi Data Ekonomi (untuk kategori 'umum')
                'pekerjaan.required' => 'Pekerjaan wajib diisi untuk kategori Masyarakat Umum.',
                'jumlah_tanggungan.required' => 'Jumlah tanggungan wajib diisi untuk kategori Masyarakat Umum.',
                'jumlah_tanggungan.integer' => 'Jumlah tanggungan harus berupa angka.',
                'jumlah_tanggungan.min' => 'Jumlah tanggungan minimal adalah 0.',
                'status_rumah.required' => 'Status kepemilikan rumah wajib dipilih untuk kategori Masyarakat Umum.',
                'status_rumah.in' => 'Pilihan status rumah tidak valid.',

                // Validasi Dokumen (untuk kategori 'umum')
                'file_sktm.required' => 'Surat Keterangan Tidak Mampu (SKTM) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_sktm.file' => 'SKTM harus berupa file yang valid.',
                'file_sktm.mimes' => 'Format file SKTM harus berupa: jpg, jpeg, png, atau pdf.',
                'file_sktm.max' => 'Ukuran file SKTM tidak boleh lebih dari 2MB.',

                'file_rumah_depan.required' => 'Foto rumah (depan) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_depan.image' => 'File untuk foto rumah (depan) harus berupa gambar.',
                'file_rumah_depan.max' => 'Ukuran file foto rumah (depan) tidak boleh lebih dari 2MB.',

                'file_rumah_belakang.required' => 'Foto rumah (belakang) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_belakang.image' => 'File untuk foto rumah (belakang) harus berupa gambar.',
                'file_rumah_belakang.max' => 'Ukuran file foto rumah (belakang) tidak boleh lebih dari 2MB.',

                'file_rumah_kiri.required' => 'Foto rumah (kiri) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_kiri.image' => 'File untuk foto rumah (kiri) harus berupa gambar.',
                'file_rumah_kiri.max' => 'Ukuran file foto rumah (kiri) tidak boleh lebih dari 2MB.',

                'file_rumah_kanan.required' => 'Foto rumah (kanan) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_kanan.image' => 'File untuk foto rumah (kanan) harus berupa gambar.',
                'file_rumah_kanan.max' => 'Ukuran file foto rumah (kanan) tidak boleh lebih dari 2MB.',
            ],
        );

        try {
            DB::beginTransaction();

            // Tentukan folder dinamis untuk foto profil
            $folderPath = $validated['kategori_pemohon'] === 'mahasiswa' ? 'mustahik-mahasiswa' : 'mustahik-umum';

            $photoPath = $request->file('photo')->store($folderPath, 'public');

            // Buat data Mustahik
            $mustahik = Mustahik::create([
                'name' => $validated['name'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'pekerjaan' => $validated['pekerjaan'] ?? null,
                'jumlah_tanggungan' => $validated['jumlah_tanggungan'] ?? 0,
                'status_rumah' => $validated['status_rumah'] ?? null,
                'nik' => $validated['nik'],
                'kk_number' => $validated['kk_number'],
                'phone_number' => $validated['phone_number'],
                'address' => $validated['address'],
                'photo' => $photoPath,
            ]);

            // Buat data Permohonan inti
            $permohonan = Permohonan::create([
                'mustahik_id' => $mustahik->id,
                'periode_id' => $activePeriode->id,
                'unique_code' => 'UPZ-' . time() . Str::upper(Str::random(4)),
                'kategori_pemohon' => $validated['kategori_pemohon'],
                'status' => $isUmum ? 'Disetujui' : 'Baru',
            ]);

            // Simpan file-file lampiran ke tabel permohonan_dokumens
            $paths = [];
            $fileKeys = [
                'file_sktm' => 'file_surat_fakir_miskin',
                'file_rumah_depan' => 'file_rumah_depan',
                'file_rumah_belakang' => 'file_rumah_belakang',
                'file_rumah_kiri' => 'file_rumah_kiri',
                'file_rumah_kanan' => 'file_rumah_kanan',
            ];
            foreach ($fileKeys as $requestKey => $dbColumn) {
                if ($request->hasFile($requestKey)) {
                    $paths[$dbColumn] = $request->file($requestKey)->store("permohonan_files/{$permohonan->id}", 'public');
                }
            }

            if (!empty($paths)) {
                PermohonanDokumen::create(array_merge(['permohonan_id' => $permohonan->id], $paths));
            }

            DB::commit();

            return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan pada sistem. Error: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan form untuk mengedit data mustahik
     */
    public function edit(Mustahik $mustahik)
    {
        // Muat relasi permohonan terbaru untuk mendapatkan kategori pemohon dan dokumennya
      $mustahik->load(['permohonans' => function ($query) {
            $query->with('dokumen')->orderBy('id', 'desc');
        }]);

        return Inertia::render('admin/mustahiks/edit', [
            'mustahik' => $mustahik,
        ]);
    }

    public function update(Request $request, Mustahik $mustahik)
    {
        $isUmum = $request->input('kategori_pemohon') === 'umum';

        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
                'kategori_pemohon' => 'required|string|in:mahasiswa,umum',
                'nik' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahik->id)],
                'kk_number' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahik->id)],
                'phone_number' => 'required|string|max:20',
                'address' => 'required|string',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'pekerjaan' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'max:255'],
                'jumlah_tanggungan' => [Rule::requiredIf($isUmum), 'nullable', 'integer', 'min:0'],
                'status_rumah' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'in:Milik Sendiri,Sewa/Kontrak,Menumpang'],
                'file_sktm' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
                'file_rumah_depan' => ['nullable', 'image', 'max:2048'],
            ],
            [
                // Validasi Data Pribadi
                'name.required' => 'Nama lengkap wajib diisi.',
                'name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',
                'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
                'jenis_kelamin.in' => 'Pilihan jenis kelamin tidak valid.',
                'kategori_pemohon.required' => 'Kategori mustahik wajib dipilih.',
                'kategori_pemohon.in' => 'Pilihan kategori tidak valid.',
                'phone_number.required' => 'Nomor telepon wajib diisi.',
                'phone_number.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
                'address.required' => 'Alamat lengkap wajib diisi.',
                'photo.required' => 'Foto mustahik wajib diunggah.',
                'photo.image' => 'File yang diunggah untuk foto harus berupa gambar.',
                'photo.mimes' => 'Format foto harus berupa: jpeg, png, jpg.',
                'photo.max' => 'Ukuran file foto tidak boleh lebih dari 2MB.',

                // Validasi Data Kependudukan
                'nik.required' => 'NIK wajib diisi.',
                'nik.size' => 'NIK harus terdiri dari 16 digit angka.',
                'nik.unique' => 'NIK ini sudah terdaftar di sistem.',
                'kk_number.required' => 'Nomor KK wajib diisi.',
                'kk_number.size' => 'Nomor KK harus terdiri dari 16 digit angka.',
                'kk_number.unique' => 'Nomor KK ini sudah terdaftar di sistem.',

                // Validasi Data Ekonomi (untuk kategori 'umum')
                'pekerjaan.required' => 'Pekerjaan wajib diisi untuk kategori Masyarakat Umum.',
                'jumlah_tanggungan.required' => 'Jumlah tanggungan wajib diisi untuk kategori Masyarakat Umum.',
                'jumlah_tanggungan.integer' => 'Jumlah tanggungan harus berupa angka.',
                'jumlah_tanggungan.min' => 'Jumlah tanggungan minimal adalah 0.',
                'status_rumah.required' => 'Status kepemilikan rumah wajib dipilih untuk kategori Masyarakat Umum.',
                'status_rumah.in' => 'Pilihan status rumah tidak valid.',

                // Validasi Dokumen (untuk kategori 'umum')
                'file_sktm.required' => 'Surat Keterangan Tidak Mampu (SKTM) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_sktm.file' => 'SKTM harus berupa file yang valid.',
                'file_sktm.mimes' => 'Format file SKTM harus berupa: jpg, jpeg, png, atau pdf.',
                'file_sktm.max' => 'Ukuran file SKTM tidak boleh lebih dari 2MB.',

                'file_rumah_depan.required' => 'Foto rumah (depan) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_depan.image' => 'File untuk foto rumah (depan) harus berupa gambar.',
                'file_rumah_depan.max' => 'Ukuran file foto rumah (depan) tidak boleh lebih dari 2MB.',

                'file_rumah_belakang.required' => 'Foto rumah (belakang) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_belakang.image' => 'File untuk foto rumah (belakang) harus berupa gambar.',
                'file_rumah_belakang.max' => 'Ukuran file foto rumah (belakang) tidak boleh lebih dari 2MB.',

                'file_rumah_kiri.required' => 'Foto rumah (kiri) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_kiri.image' => 'File untuk foto rumah (kiri) harus berupa gambar.',
                'file_rumah_kiri.max' => 'Ukuran file foto rumah (kiri) tidak boleh lebih dari 2MB.',

                'file_rumah_kanan.required' => 'Foto rumah (kanan) wajib diunggah untuk kategori Masyarakat Umum.',
                'file_rumah_kanan.image' => 'File untuk foto rumah (kanan) harus berupa gambar.',
                'file_rumah_kanan.max' => 'Ukuran file foto rumah (kanan) tidak boleh lebih dari 2MB.',
            ],
        );

        try {
            DB::beginTransaction();

            // Update data mustahik
            $mustahikData = $request->only(['name', 'jenis_kelamin', 'pekerjaan', 'jumlah_tanggungan', 'status_rumah', 'nik', 'kk_number', 'phone_number', 'address']);

            if ($request->hasFile('photo')) {
                if ($mustahik->photo) {
                    Storage::disk('public')->delete($mustahik->photo);
                }
                $folderPath = $validated['kategori_pemohon'] === 'mahasiswa' ? 'mustahik-mahasiswa' : 'mustahik-umum';
                $mustahikData['photo'] = $request->file('photo')->store($folderPath, 'public');
            }

            $mustahik->update($mustahikData);

            // Update permohonan terbaru dan dokumen terkait
            $permohonan = $mustahik->permohonans()->latest()->first();
            if ($permohonan) {
                $permohonan->update(['kategori_pemohon' => $validated['kategori_pemohon']]);

                $dokumen = $permohonan->dokumen()->firstOrNew(['permohonan_id' => $permohonan->id]);

                $fileKeys = [
                    'file_sktm' => 'file_surat_fakir_miskin',
                    'file_rumah_depan' => 'file_rumah_depan',
                    'file_rumah_belakang' => 'file_rumah_belakang',
                    'file_rumah_kiri' => 'file_rumah_kiri',
                    'file_rumah_kanan' => 'file_rumah_kanan',
                ];

                foreach ($fileKeys as $requestKey => $dbColumn) {
                    if ($request->hasFile($requestKey)) {
                        if ($dokumen->{$dbColumn}) {
                            Storage::disk('public')->delete($dokumen->{$dbColumn});
                        }
                        $dokumen->{$dbColumn} = $request->file($requestKey)->store("permohonan_files/{$permohonan->id}", 'public');
                    }
                }

                $dokumen->save();
            }

            DB::commit();

            return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan pada sistem. Error: ' . $e->getMessage());
        }
    }

    // Menghapus data mustahik dari database
    public function destroy(Mustahik $mustahik)
    {
        // Hapus foto dari storage jika ada sebelum menghapus record
        if ($mustahik->photo) {
            Storage::disk('public')->delete($mustahik->photo);
        }

        // Menghapus permohonan terkait akan menghapus dokumen (via cascade/observer jika diatur)
        // Untuk amannya, kita hapus manual file dokumennya
        foreach ($mustahik->permohonans as $permohonan) {
            if ($permohonan->dokumen) {
                $files = $permohonan->dokumen->getAttributes();
                foreach ($files as $key => $path) {
                    if (Str::startsWith($key, 'file_') && $path) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
        }

        $mustahik->delete(); // Karena ada cascade on delete, permohonan dan dokumen akan ikut terhapus

        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil dihapus.');
    }

    public function show(Mustahik $mustahik)
    {
        // Ambil persentase alokasi
        $alokasiPersen = (float) Setting::where('setting_key', 'alokasi_fakir_miskin_persen')->value('setting_value') ?: 10;
        $persenFakirMiskin = $alokasiPersen / 100;
        $persenKampus = 1 - $persenFakirMiskin;

        // Hitung total dana masuk
        $totalDanaZakat = Transaksi::where('status', 'Berhasil')->where('type', 'zakat')->sum('final_amount');
        $totalInfaqTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'infaq')->sum('final_amount');
        $totalSedekahTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'sedekah')->sum('final_amount');

        // Hitung total dana keluar
        $penyaluranFakirMiskin = Penyaluran::where('kategori_alokasi', 'fakir_miskin')->sum('amount');
        $penyaluranKampus = Penyaluran::where('kategori_alokasi', 'kampus')->sum('amount');
        $penyaluranInfaq = Penyaluran::where('kategori_alokasi', 'infaq')->sum('amount');
        $penyaluranSedekah = Penyaluran::where('kategori_alokasi', 'sedekah')->sum('amount');

        // Hitung sisa saldo
        $availableFunds = [
            'sisaDanaKampus' => ($totalDanaZakat * $persenKampus) - $penyaluranKampus,
            'sisaDanaFakirMiskin' => ($totalDanaZakat * $persenFakirMiskin) - $penyaluranFakirMiskin,
            'sisaDanaInfaq' => $totalInfaqTerkumpul - $penyaluranInfaq,
            'sisaDanaSedekah' => $totalSedekahTerkumpul - $penyaluranSedekah,
        ];

        // Muat relasi mustahik
        $mustahik->load([
            'permohonans' => function ($query) {
                $query->with(['periode', 'penyalurans.admin', 'dokumen'])->latest();
            },
        ]);

        return Inertia::render('admin/mustahiks/show', [
            'mustahik' => $mustahik,
            'availableFunds' => $availableFunds,
        ]);
    }
}
