<?php

namespace App\Repositories\Admin;

use App\Models\JenisZakat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

/**
 * Class ZakatTypeRepository
 *
 * Repositori ini bertanggung jawab untuk semua interaksi database
 * yang terkait dengan model JenisZakat.
 */
class ZakatTypeRepository
{
    /**
     * Mengambil daftar jenis zakat dengan paginasi dan filter.
     *
     * @param  Request  $request
     * @return LengthAwarePaginator
     */
    public function getPaginated(Request $request): LengthAwarePaginator
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 5);

        return JenisZakat::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Membuat data jenis zakat baru.
     *
     * @param  array  $data
     * @return JenisZakat
     */
    public function create(array $data): JenisZakat
    {
        return JenisZakat::create($data);
    }

    /**
     * Memperbarui data jenis zakat yang ada.
     *
     * @param  JenisZakat  $zakatType
     * @param  array  $data
     * @return bool
     */
    public function update(JenisZakat $zakatType, array $data): bool
    {
        return $zakatType->update($data);
    }

    /**
     * Menghapus data jenis zakat.
     *
     * @param  JenisZakat  $zakatType
     * @return bool|null
     */
    public function delete(JenisZakat $zakatType): ?bool
    {
        return $zakatType->delete();
    }
}
