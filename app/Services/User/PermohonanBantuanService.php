<?php

namespace App\Services\User;

use App\Http\Requests\User\StorePermohonanBantuanRequest;
use App\Models\Permohonan;
use App\Repositories\User\PermohonanBantuanRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class PermohonanBantuanService
 * @package App\Services\User
 * @description Service untuk mengelola logika bisnis terkait permohonan bantuan.
 * Kelas ini menjadi jembatan antara Controller dan Repository.
 */
class PermohonanBantuanService
{
    /**
     * @var PermohonanBantuanRepository
     */
    protected $repository;

    /**
     * PermohonanBantuanService constructor.
     *
     * @param PermohonanBantuanRepository $repository
     */
    public function __construct(PermohonanBantuanRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Memproses dan menyimpan permohonan bantuan baru.
     * Mengelola transaksi database dan penyimpanan file.
     *
     * @param StorePermohonanBantuanRequest $request
     * @return Permohonan
     * @throws \Exception
     */
    public function storePermohonan(StorePermohonanBantuanRequest $request): Permohonan
    {
        $validatedData = $request->validated();
        $activePeriode = $this->repository->findActivePeriode();

        // Meskipun sudah divalidasi di FormRequest, pengecekan di service layer
        // berfungsi sebagai lapisan pertahanan kedua (defense in depth).
        if (!$activePeriode) {
            throw new \Exception('Saat ini tidak ada periode pendaftaran yang dibuka.');
        }

        // Menggunakan transaction untuk memastikan semua operasi database berhasil atau gagal bersamaan.
        return DB::transaction(function () use ($request, $validatedData, $activePeriode) {
            // 1. Simpan foto mustahik ke storage
            $photoPath = $request->file('photo')->store('mustahik-photos', 'public');

            // 2. Buat atau update data mustahik melalui repository
            $mustahik = $this->repository->updateOrCreateMustahik([
                'nik' => $validatedData['nik'],
                'name' => $validatedData['name'],
                'jenis_kelamin' => $validatedData['jenis_kelamin'],
                'kk_number' => $validatedData['kk_number'],
                'phone_number' => $validatedData['phone_number'],
                'address' => $validatedData['address'],
                'photo' => $photoPath,
            ]);

            // 3. Buat data permohonan baru
            $uniqueCode = 'UPZIS-' . time() . Str::upper(Str::random(4));
            $permohonan = $this->repository->createPermohonan([
                'mustahik_id' => $mustahik->id,
                'periode_id' => $activePeriode->id,
                'kategori_pemohon' => 'mahasiswa', // Sesuai form publik
                'unique_code' => $uniqueCode,
                'status' => 'Baru',
            ]);

            // 4. Simpan semua file dokumen yang diunggah
            $fileKeys = ['file_ktp', 'file_kk', 'file_khs', 'file_surat_fakir_miskin', 'file_tidak_menerima_beasiswa', 'file_surat_permohonan'];
            $paths = [];
            foreach ($fileKeys as $fileKey) {
                if ($request->hasFile($fileKey)) {
                    $paths[$fileKey] = $request->file($fileKey)->store("permohonan_files/{$permohonan->id}", 'public');
                }
            }

            // 5. Buat record untuk dokumen permohonan
            $this->repository->createPermohonanDokumen([
                'permohonan_id' => $permohonan->id,
                'file_ktp' => $paths['file_ktp'] ?? null,
                'file_kk' => $paths['file_kk'] ?? null,
                'file_khs' => $paths['file_khs'] ?? null,
                'file_surat_fakir_miskin' => $paths['file_surat_fakir_miskin'] ?? null,
                'file_tidak_menerima_beasiswa' => $paths['file_tidak_menerima_beasiswa'] ?? null,
                'file_surat_permohonan' => $paths['file_surat_permohonan'] ?? null,
            ]);

            return $permohonan;
        });
    }

    /**
     * Melacak status permohonan berdasarkan kode unik atau identifier (NIK/No. HP).
     *
     * @param Request $request
     * @return Permohonan|null
     */
    public function lacakPermohonan(Request $request): ?Permohonan
    {
        if ($request->filled('kode')) {
            return $this->repository->findPermohonanByUniqueCode($request->input('kode'));
        }

        if ($request->filled('identifier')) {
            $mustahik = $this->repository->findMustahikByIdentifier($request->input('identifier'));
            if ($mustahik) {
                return $this->repository->findLatestPermohonanByMustahikId($mustahik->id);
            }
        }

        return null;
    }
}
