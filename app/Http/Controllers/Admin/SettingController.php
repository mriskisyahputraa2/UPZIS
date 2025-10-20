<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SettingController extends Controller
{
  /**
     * Menampilkan halaman form pengaturan umum.
     */
    public function edit()
    {
        // Ambil semua data pengaturan dan ubah menjadi format key => value
        $settings = Setting::all()->pluck('setting_value', 'setting_key')->all();

        return Inertia::render('admin/settings/general/index', [
            'settings' => $settings
        ]);
    }

    /**
     * Menyimpan perubahan pengaturan umum.
     */
    public function update(Request $request)
    {
        // Validasi data yang masuk
        $validatedData = $request->validate([
            'harga_emas_per_gram' => 'required|numeric|min:0',
            'contact_address' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'alokasi_fakir_miskin_persen' => 'required|numeric|min:0|max:100',
        ]);

        // Loop melalui setiap data yang tervalidasi dan simpan ke database
        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        // Jika harga emas diperbarui, hapus cache-nya
        if (array_key_exists('harga_emas_per_gram', $validatedData)) {
            Cache::forget('harga_emas_per_gram');
        }

        // Kembali ke halaman sebelumnya dengan pesan sukses
        return Redirect::back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

     /**
     * Menampilkan halaman form pengaturan akun pembayaran.
     */
    public function paymentEdit()
    {
        // Ambil data dari database
        $settings = Setting::whereIn('setting_key', ['payment_dana', 'payment_gopay', 'payment_tunai'])
            ->get()
            ->pluck('setting_value', 'setting_key');

        // Decode setiap nilai JSON menjadi array agar mudah diolah di frontend
        $paymentSettings = [
            'dana' => json_decode($settings->get('payment_dana'), true),
            'gopay' => json_decode($settings->get('payment_gopay'), true),
            'tunai' => json_decode($settings->get('payment_tunai'), true),
        ];

        return Inertia::render('admin/settings/payment-accounts/index', [
            'paymentSettings' => $paymentSettings,
        ]);
    }

    /**
     * Menyimpan perubahan pengaturan akun pembayaran.
     */
    public function paymentUpdate(Request $request)
    {
        // Validasi data yang masuk (termasuk array 'steps')
        $validatedData = $request->validate([
            'dana.account' => 'required|string|max:100',
            'dana.name' => 'required|string|max:100',
            'dana.steps' => 'required|array|min:1',
            'dana.steps.*' => 'required|string|max:255',

            'gopay.account' => 'required|string|max:100',
            'gopay.name' => 'required|string|max:100',
            'gopay.steps' => 'required|array|min:1',
            'gopay.steps.*' => 'required|string|max:255',

            'tunai.account' => 'required|string|max:100',
            'tunai.name' => 'required|string|max:100',
            'tunai.steps' => 'required|array|min:1',
            'tunai.steps.*' => 'required|string|max:255',
        ]);

        // Loop, encode ke JSON, dan simpan ke database
        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(
                ['setting_key' => 'payment_' . $key],
                ['setting_value' => json_encode($value)]
            );
        }

        return Redirect::back()->with('success', 'Pengaturan akun pembayaran berhasil diperbarui.');
    }
}
