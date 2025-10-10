<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MustahikController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\PermohonanController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\KalkulatorController;
use App\Http\Controllers\Muzakki\TransaksiController;
use App\Http\Controllers\PermohonanBantuanController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| HALAMAN PUBLIK (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/

// Halaman Beranda
Route::get('/', [HomePageController::class, 'index'])->name('home');
// Halaman Ajukan Bantuan
Route::get('ajukan-bantuan', [PermohonanBantuanController::class, 'create'])->name('permohonan.create');
Route::post('ajukan-bantuan', [PermohonanBantuanController::class, 'store'])->name('permohonan.store');
Route::get('pendaftaran-berhasil', [PermohonanBantuanController::class, 'success'])->name('permohonan.success');
Route::get('lacak-status', [PermohonanBantuanController::class, 'lacak'])->name('permohonan.lacak');
// Rute untuk menampilkan halaman kalkulator
Route::get('kalkulator-zakat', [KalkulatorController::class, 'index'])->name('kalkulator.index');
Route::post('kalkulator-zakat/hitung', [KalkulatorController::class, 'hitung'])->name('kalkulator.hitung');

/*
|--------------------------------------------------------------------------
| DASHBOARD PENGGUNA (Untuk Muzakki)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Halaman Profil Pengguna
    |--------------------------------------------------------------------------
    | Dikelompokkan di sini untuk kerapian. Menggunakan URL /profile.
    */
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    /*
    |--------------------------------------------------------------------------
    | Halaman Transaksi Pengguna
    |--------------------------------------------------------------------------
    */
    Route::get('bayar-zakat', [TransaksiController::class, 'create'])->name('transaksi.create');
    Route::post('bayar-zakat', [TransaksiController::class, 'store'])->name('transaksi.store');
    Route::get('transaksi/{order_id}', [TransaksiController::class, 'show'])->name('transaksi.show');
    Route::post('transaksi/{order_id}/upload', [TransaksiController::class, 'uploadProof'])->name('transaksi.upload');
});

/*
|--------------------------------------------------------------------------
| AREA ADMIN & SUPERADMIN (Fitur Baru)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin,superadmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Manajemen Mustahik
        Route::resource('mustahiks', MustahikController::class);

        // Manajemen Permohonan dan Status
        Route::resource('permohonan', PermohonanController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::post('permohonan/bulk-update-status', [PermohonanController::class, 'bulkUpdateStatus'])->name('permohonan.bulkUpdateStatus');

        // Manajemen Periode
        Route::resource('/periode', PeriodeController::class);
    });

/*
|--------------------------------------------------------------------------
| FILE RUTE BAWAAN
|--------------------------------------------------------------------------
*/
// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
