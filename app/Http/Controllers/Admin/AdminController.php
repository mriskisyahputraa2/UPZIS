<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Models\User;
use App\Repositories\Admin\AdminRepository;
use App\Services\Admin\AdminService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class AdminController
 *
 * Controller ini menangani semua tindakan terkait manajemen pengguna admin.
 */
class AdminController extends Controller
{
    /**
     * @var AdminRepository
     */
    protected $adminRepository;

    /**
     * @var AdminService
     */
    protected $adminService;

    /**
     * AdminController constructor.
     *
     * @param  AdminRepository  $adminRepository
     * @param  AdminService  $adminService
     */
    public function __construct(AdminRepository $adminRepository, AdminService $adminService)
    {
        $this->adminRepository = $adminRepository;
        $this->adminService = $adminService;
    }

    /**
     * Menampilkan daftar pengguna admin.
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|in:5,10,20,50',
        ]);

        $admins = $this->adminRepository->getPaginated($request);

        return Inertia::render('admin/settings/admins/index', [
            'admins' => $admins,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat admin baru.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('admin/settings/admins/create');
    }

    /**
     * Menyimpan admin baru ke database.
     *
     * @param  StoreAdminRequest  $request
     * @return RedirectResponse
     */
    public function store(StoreAdminRequest $request): RedirectResponse
    {
        $this->adminService->createAdmin($request->validated());

        return redirect()->route('admin.settings.admins.index')->with('success', 'Admin baru berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit data admin.
     *
     * @param  User  $admin
     * @return Response
     */
    public function edit(User $admin): Response
    {
        return Inertia::render('admin/settings/admins/edit', [
            'admin' => $admin,
        ]);
    }

    /**
     * Memperbarui data admin di database.
     *
     * @param  UpdateAdminRequest  $request
     * @param  User  $admin
     * @return RedirectResponse
     */
    public function update(UpdateAdminRequest $request, User $admin): RedirectResponse
    {
        $this->adminService->updateAdmin($admin, $request->validated());

        return redirect()->route('admin.settings.admins.index')->with('success', 'Data admin berhasil diperbarui.');
    }

    /**
     * Menghapus admin dari database.
     *
     * @param  User  $admin
     * @return RedirectResponse
     */
    public function destroy(User $admin): RedirectResponse
    {
        try {
            $this->adminService->deleteAdmin($admin);

            return redirect()->back()->with('success', 'Akun admin berhasil dihapus.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
