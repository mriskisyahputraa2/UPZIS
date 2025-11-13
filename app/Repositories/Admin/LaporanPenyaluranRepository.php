<?php

namespace App\Repositories\Admin;

use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Permohonan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

/**
 * Class LaporanPenyaluranRepository
 *
 * Bertanggung jawab untuk semua interaksi database terkait laporan penyaluran.
 *
 * @package App\Repositories\Admin
 */
class LaporanPenyaluranRepository
{
    /**
     * Membuat query dasar untuk penyaluran dengan filter yang diterapkan.
     *
     * @param array $filters Filter yang divalidasi dari request.
     * @return Builder
     */
    public function getFilteredQuery(array $filters): Builder
    {
        return Penyaluran::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->whereHas('permohonan.mustahik', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($filters['kategori_pemohon'] ?? null, function ($query, $kategori) {
                $query->whereHas('permohonan', function ($q) use ($kategori) {
                    $q->where('kategori_pemohon', $kategori);
                });
            })
            ->when($filters['periode_id'] ?? null, function ($query, $periodeId) {
                $query->whereHas('permohonan', function ($q) use ($periodeId) {
                    $q->where('periode_id', $periodeId);
                });
            })
            ->when($filters['kategori_alokasi'] ?? null, function ($query, $kategori) {
                $query->where('kategori_alokasi', $kategori);
            })
            ->when(isset($filters['start_date']) && isset($filters['end_date']), function ($query) use ($filters) {
                $startDate = Carbon::parse($filters['start_date'])->startOfDay();
                $endDate = Carbon::parse($filters['end_date'])->endOfDay();
                $query->whereBetween('distribution_date', [$startDate, $endDate]);
            });
    }

    /**
     * Menghitung ringkasan (total jumlah dan mustahik unik) dari query yang diberikan.
     *
     * @param Builder $query
     * @return array
     */
    public function getSummary(Builder $query): array
    {
        // Ambil semua ID permohonan yang unik dari hasil filter
        $permohonanIds = (clone $query)->distinct()->pluck('permohonan_id');

        // Hitung jumlah mustahik_id yang unik dari ID permohonan tersebut
        $uniqueMustahikCount = Permohonan::whereIn('id', $permohonanIds)->distinct()->count('mustahik_id');

        return [
            'totalAmount' => (clone $query)->sum('amount'),
            'uniqueMustahik' => $uniqueMustahikCount,
        ];
    }

    /**
     * Mengambil semua periode dari database.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPeriodes()
    {
        return Periode::latest()->get(['id', 'name']);
    }

    /**
     * Mencari periode berdasarkan ID.
     *
     * @param int $id
     * @return Periode|null
     */
    public function findPeriodeById(int $id): ?Periode
    {
        return Periode::find($id);
    }
}
