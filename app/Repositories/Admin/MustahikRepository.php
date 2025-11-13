<?php

namespace App\Repositories\Admin;

use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use App\Models\PermohonanDokumen;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * @summary Repositori untuk mengelola data Mustahik.
 *
 * @description
 * Kelas ini bertanggung jawab untuk semua interaksi dengan database
 * yang terkait dengan model Mustahik. Ini mengisolasi logika query
 * dari controller dan service, membuatnya lebih mudah untuk diuji dan dikelola.
 */
class MustahikRepository
{
    /**
     * @summary Mengambil data mustahik yang disetujui dengan filter dan paginasi.
     *
     * @param Request $request Data request yang berisi filter.
     * @return LengthAwarePaginator
     */
    public function getApprovedMustahiks(Request $request): LengthAwarePaginator
    {
        $activePeriode = $this->getActivePeriode();
        $query = Mustahik::query()
            ->with('latestPermohonan')
            ->whereHas('permohonans', fn ($q) => $q->where('status', 'Disetujui'))
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->input('jenis_kelamin'), fn ($q, $val) => $q->where('jenis_kelamin', $val))
            ->when($request->input('kategori_pemohon'), function ($query, $kategori) {
                $query->whereHas('latestPermohonan', fn ($q) => $q->where('kategori_pemohon', $kategori));
            });

        if ($request->filled('periode_id')) {
            $query->whereHas('permohonans', fn ($q) => $q->where('periode_id', $request->input('periode_id')));
        } elseif (!$request->has('periode_id') && $activePeriode) {
            $query->whereHas('permohonans', fn ($q) => $q->where('periode_id', $activePeriode->id));
        }

        return $query->distinct()->latest()->paginate($request->input('per_page', 5))->withQueryString();
    }

    /**
     * @summary Mengambil semua periode.
     *
     * @return Collection
     */
    public function getAllPeriodes(): Collection
    {
        return Periode::latest()->get(['id', 'name']);
    }

    /**
     * @summary Mengambil periode yang sedang aktif.
     *
     * @return Periode|null
     */
    public function getActivePeriode(): ?Periode
    {
        return Periode::where('status', 'Aktif')->first();
    }

    /**
     * @summary Mencari mustahik berdasarkan NIK.
     *
     * @param string $nik
     * @return Mustahik|null
     */
    public function findByNik(string $nik): ?Mustahik
    {
        return Mustahik::where('nik', $nik)->first();
    }

    /**
     * @summary Mencari mustahik berdasarkan Nomor KK.
     *
     * @param string $kkNumber
     * @return Mustahik|null
     */
    public function findByKkNumber(string $kkNumber): ?Mustahik
    {
        return Mustahik::where('kk_number', $kkNumber)->first();
    }

    /**
     * @summary Memeriksa apakah mustahik sudah memiliki permohonan di periode tertentu.
     *
     * @param int $mustahikId
     * @param int $periodeId
     * @return bool
     */
    public function hasPermohonanInPeriod(int $mustahikId, int $periodeId): bool
    {
        return Permohonan::where('mustahik_id', $mustahikId)->where('periode_id', $periodeId)->exists();
    }

    /**
     * @summary Membuat atau memperbarui data mustahik.
     *
     * @description
     * Menggunakan NIK sebagai kunci unik untuk mencari data. Jika ditemukan,
     * data akan diperbarui. Jika tidak, data baru akan dibuat.
     *
     * @param array $data Data mustahik yang akan disimpan.
     * @return Mustahik
     */
    public function updateOrCreateMustahik(array $data): Mustahik
    {
        return Mustahik::updateOrCreate(['nik' => $data['nik']], $data);
    }

    /**
     * @summary Membuat data permohonan baru.
     *
     * @param Mustahik $mustahik
     * @param array $data
     * @param int $periodeId
     * @return Permohonan
     */
    public function createPermohonan(Mustahik $mustahik, array $data, int $periodeId): Permohonan
    {
        return Permohonan::create([
            'mustahik_id' => $mustahik->id,
            'periode_id' => $periodeId,
            'unique_code' => 'UPZ-' . time() . Str::upper(Str::random(4)),
            'kategori_pemohon' => $data['kategori_pemohon'],
            'status' => $data['kategori_pemohon'] === 'umum' ? 'Disetujui' : 'Baru',
        ]);
    }

    /**
     * @summary Membuat data dokumen permohonan.
     *
     * @param int $permohonanId
     * @param array $paths
     * @return PermohonanDokumen
     */
    public function createPermohonanDokumen(int $permohonanId, array $paths): PermohonanDokumen
    {
        return PermohonanDokumen::create(array_merge(['permohonan_id' => $permohonanId], $paths));
    }

    /**
     * @summary Memuat relasi yang dibutuhkan untuk halaman edit.
     *
     * @param Mustahik $mustahik
     * @return Mustahik
     */
    public function loadEditRelations(Mustahik $mustahik): Mustahik
    {
        return $mustahik->load([
            'permohonans' => fn ($query) => $query->with('dokumen')->orderBy('id', 'desc'),
        ]);
    }

    /**
     * @summary Memuat relasi yang dibutuhkan untuk halaman detail (show).
     *
     * @param Mustahik $mustahik
     * @return Mustahik
     */
    public function loadShowRelations(Mustahik $mustahik): Mustahik
    {
        return $mustahik->load([
            'permohonans' => fn ($query) => $query->with(['periode', 'penyalurans.admin', 'dokumen'])->latest(),
        ]);
    }
}
