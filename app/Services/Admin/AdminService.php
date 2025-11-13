<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Repositories\Admin\AdminRepository;
use Exception;
use Illuminate\Support\Arr;

/**
 * Class AdminService
 *
 * Service ini menangani logika bisnis yang terkait dengan pengelolaan admin.
 */
class AdminService
{
    /**
     * @var AdminRepository
     */
    protected $adminRepository;

    /**
     * AdminService constructor.
     *
     * @param  AdminRepository  $adminRepository
     */
    public function __construct(AdminRepository $adminRepository)
    {
        $this->adminRepository = $adminRepository;
    }

    /**
     * Membuat admin baru.
     *
     * @param  array  $data
     * @return User
     */
    public function createAdmin(array $data): User
    {
        // Menambahkan peran 'admin' secara otomatis
        $data['role'] = 'admin';

        return $this->adminRepository->create($data);
    }

    /**
     * Memperbarui data admin.
     *
     * @param  User  $admin
     * @param  array  $data
     * @return bool
     */
    public function updateAdmin(User $admin, array $data): bool
    {
        // Filter data yang tidak relevan jika ada
        $updateData = Arr::only($data, ['name', 'email', 'password']);

        return $this->adminRepository->update($admin, $updateData);
    }

    /**
     * Menghapus admin dengan validasi aturan bisnis.
     *
     * @param  User  $admin
     * @return bool
     *
     * @throws Exception
     */
    public function deleteAdmin(User $admin): bool
    {
        // Aturan Bisnis: Pengguna tidak dapat menghapus akunnya sendiri.
        if ($admin->id === auth()->id()) {
            throw new Exception('Anda tidak dapat menghapus akun Anda sendiri.');
        }

        return $this->adminRepository->delete($admin);
    }
}
