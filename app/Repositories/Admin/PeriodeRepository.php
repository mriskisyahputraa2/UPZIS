<?php

namespace App\Repositories\Admin;

use App\Models\Periode;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

/**
 * Class PeriodeRepository
 *
 * Repositori ini bertanggung jawab untuk semua interaksi database
 * yang terkait dengan model Periode.
 */
class PeriodeRepository
{
    /**
     * Mengambil daftar periode dengan paginasi dan filter pencarian.
     *
     * @param  Request  $request
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(Request $request): LengthAwarePaginator
    {
        return Periode::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 5))
            ->withQueryString();
    }

    /**
     * Membuat data periode baru.
     *
     * @param  array  $data
     * @return Periode
     */
    public function create(array $data): Periode
    {
        return Periode::create($data);
    }

    /**
     * Memperbarui data periode yang ada.
     *
     * @param  Periode  $periode
     * @param  array  $data
     * @return bool
     */
    public function update(Periode $periode, array $data): bool
    {
        return $periode->update($data);
    }

    /**
     * Menghapus data periode.
     *
     * @param  Periode  $periode
     * @return bool|null
     */
    public function delete(Periode $periode): ?bool
    {
        return $periode->delete();
    }

    /**
     * Menonaktifkan semua periode lain yang berstatus 'Aktif'.
     * Jika $exceptId diberikan, periode dengan ID tersebut akan dikecualikan.
     *
     * @param  int|null  $exceptId
     * @return void
     */
    public function deactivateOthers(?int $exceptId = null): void
    {
        $query = Periode::where('status', 'Aktif');

        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }

        $query->update(['status' => 'Tidak Aktif']);
    }

    /**
     * Memeriksa apakah periode memiliki permohonan terkait.
     *
     * @param  Periode  $periode
     * @return bool
     */
    public function hasPermohonan(Periode $periode): bool
    {
        return $periode->permohonans()->exists();
    }
}
