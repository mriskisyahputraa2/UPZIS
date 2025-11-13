<?php

namespace App\Repositories\Admin;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

/**
 * Class AdminRepository
 *
 * Repositori ini bertanggung jawab untuk semua interaksi database
 * yang terkait dengan pengguna ber-peran 'admin'.
 */
class AdminRepository
{
    /**
     * Mengambil daftar admin dengan paginasi dan filter.
     *
     * @param  Request  $request
     * @return LengthAwarePaginator
     */
    public function getPaginated(Request $request): LengthAwarePaginator
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 5);

        return User::query()
            ->where('role', 'admin')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Membuat data admin baru.
     *
     * @param  array  $data
     * @return User
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Memperbarui data admin yang ada.
     *
     * @param  User  $admin
     * @param  array  $data
     * @return bool
     */
    public function update(User $admin, array $data): bool
    {
        // Filter out password jika tidak diisi
        $updateData = Arr::except($data, ['password']);

        if (! empty($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        return $admin->update($updateData);
    }

    /**
     * Menghapus data admin.
     *
     * @param  User  $admin
     * @return bool|null
     */
    public function delete(User $admin): ?bool
    {
        return $admin->delete();
    }
}
