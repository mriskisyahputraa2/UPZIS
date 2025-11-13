<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateGeneralSettingsRequest;
use App\Http\Requests\Admin\UpdatePaymentSettingsRequest;
use App\Services\Admin\SettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class SettingController
 *
 * Controller ini menangani semua tindakan terkait manajemen pengaturan aplikasi.
 */
class SettingController extends Controller
{
    /**
     * @var SettingService
     */
    protected $settingService;

    /**
     * SettingController constructor.
     *
     * @param  SettingService  $settingService
     */
    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    /**
     * Menampilkan halaman form pengaturan umum.
     *
     * @return Response
     */
    public function edit(): Response
    {
        $settings = $this->settingService->getGeneralSettings();

        return Inertia::render('admin/settings/general/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Menyimpan perubahan pengaturan umum.
     *
     * @param  UpdateGeneralSettingsRequest  $request
     * @return RedirectResponse
     */
    public function update(UpdateGeneralSettingsRequest $request): RedirectResponse
    {
        $this->settingService->updateGeneralSettings($request->validated());

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    /**
     * Menampilkan halaman form pengaturan akun pembayaran.
     *
     * @return Response
     */
    public function paymentEdit(): Response
    {
        $paymentSettings = $this->settingService->getPaymentSettings();

        return Inertia::render('admin/settings/payment-accounts/index', [
            'paymentSettings' => $paymentSettings,
        ]);
    }

    /**
     * Menyimpan perubahan pengaturan akun pembayaran.
     *
     * @param  UpdatePaymentSettingsRequest  $request
     * @return RedirectResponse
     */
    public function paymentUpdate(UpdatePaymentSettingsRequest $request): RedirectResponse
    {
        $this->settingService->updatePaymentSettings($request->validated());

        return redirect()->back()->with('success', 'Pengaturan akun pembayaran berhasil diperbarui.');
    }
}