<?php

/**
 * @file
 * @summary Definisi rute web untuk aplikasi UPZIS.
 *
 * @description
 * File ini berisi semua rute yang dapat diakses melalui browser. Rute-rute ini
 * dikelompokkan menjadi tiga bagian utama:
 * 1. Rute Publik: Dapat diakses oleh siapa saja tanpa perlu login.
 * 2. Rute Pengguna (Muzakki): Memerlukan autentikasi dan ditujukan untuk pengguna yang login.
 * 3. Rute Admin: Memerlukan autentikasi dan hak akses 'admin' atau 'superadmin'.
 *
 * Pengelompokan menggunakan Route::group(), Route::prefix(), Route::name(), dan Route::controller()
 * untuk menjaga agar file ini tetap terstruktur dan mudah dikelola.
 */

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ContactControllerAdmin;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LaporanPenyaluranController;
use App\Http\Controllers\Admin\MustahikController;
use App\Http\Controllers\Admin\PenyaluranController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\PermohonanController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StrukturOrganisasiController as AdminStrukturOrganisasiController;
use App\Http\Controllers\Admin\TransaksiAdminController;
use App\Http\Controllers\Admin\ZakatTypeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\KalkulatorController;
use App\Http\Controllers\Muzakki\TransaksiController;
use App\Http\Controllers\PermohonanBantuanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StrukturOrganisasiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK
|--------------------------------------------------------------------------
| Rute-rute ini dapat diakses oleh siapa saja (pengunjung) tanpa perlu
| melakukan autentikasi (login).
|--------------------------------------------------------------------------
*/

Route::get('/', [HomePageController::class, 'index'])->name('home');
Route::get('struktur-organisasi', [StrukturOrganisasiController::class, 'index'])->name('struktur-organisasi.index');

// --- Halaman Permohonan Bantuan ---
Route::controller(PermohonanBantuanController::class)->group(function () {
    Route::get('ajukan-bantuan', 'create')->name('permohonan.create');
    Route::post('ajukan-bantuan', 'store')->name('permohonan.store');
    Route::get('pendaftaran-berhasil', 'success')->name('permohonan.success');
    Route::get('lacak-status', 'lacak')->name('permohonan.lacak');
});

// --- Halaman Kalkulator Zakat ---
Route::controller(KalkulatorController::class)->prefix('kalkulator-zakat')->name('kalkulator.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/hitung', 'hitung')->name('hitung');
});

// --- Halaman Galeri Program ---
Route::controller(GaleriController::class)->prefix('galeri')->name('galeri.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/{program}', 'show')->name('show');
});

// --- Halaman Kontak ---
Route::controller(ContactController::class)->prefix('kontak')->name('kontak.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store')->middleware('throttle:1,1');
});

// --- Halaman Pilihan Donasi (Publik) ---
Route::get('donasi', [TransaksiController::class, 'selectDonationType'])->name('donasi.select');


/*
|--------------------------------------------------------------------------
| RUTE PENGGUNA (MUZAKKI)
|--------------------------------------------------------------------------
| Rute-rute ini memerlukan pengguna untuk login terlebih dahulu.
| Digunakan untuk fitur-fitur yang terkait dengan akun pengguna.
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // --- Manajemen Profil Pengguna ---
    Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
        Route::get('/', 'index')->name('edit');
        Route::post('/', 'update')->name('update');
        Route::put('/password', 'updatePassword')->name('password.update');
    });

    // --- Manajemen Transaksi (Donasi) oleh Pengguna ---
    Route::controller(TransaksiController::class)->group(function () {
        Route::get('donasi/zakat', 'create')->name('donasi.create.zakat');
        Route::get('donasi/{type}', 'createInfaqSedekah')->name('donasi.create.other')->where('type', 'infaq|sedekah');
        Route::post('donasi', 'store')->name('donasi.store');
        Route::get('transaksi/{order_id}', 'show')->name('transaksi.show');
        Route::post('transaksi/{order_id}/upload', 'uploadProof')->name('transaksi.upload');
    });
});


/*
|--------------------------------------------------------------------------
| RUTE ADMIN & SUPERADMIN
|--------------------------------------------------------------------------
| Rute-rute ini hanya dapat diakses oleh pengguna dengan peran 'admin'
| atau 'superadmin'. Semua rute di sini memiliki prefix '/admin' dan
| nama rute diawali dengan 'admin.'.
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin,superadmin'])->prefix('admin')->name('admin.')->group(function () {
    // --- Dashboard ---
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- Manajemen Struktur Organisasi ---
    Route::controller(AdminStrukturOrganisasiController::class)->prefix('struktur-organisasi')->name('struktur-organisasi.')->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::post('/', 'update')->name('update');
    });

    // --- Manajemen Mustahik ---
    Route::get('mustahiks-export-excel', [MustahikController::class, 'exportExcel'])->name('mustahiks.export.excel');
    Route::get('mustahiks-export-pdf', [MustahikController::class, 'exportPdf'])->name('mustahiks.export.pdf');
    Route::resource('mustahiks', MustahikController::class);

    // --- Manajemen Permohonan ---
    Route::post('permohonan/bulk-update-status', [PermohonanController::class, 'bulkUpdateStatus'])->name('permohonan.bulkUpdateStatus');
    Route::resource('permohonan', PermohonanController::class)->only(['index', 'show', 'update', 'destroy']);

    // --- Manajemen Penyaluran (terkait Permohonan) ---
    Route::controller(PenyaluranController::class)->group(function () {
        Route::post('permohonan/{permohonan}/penyaluran', 'store')->name('permohonan.penyaluran.store');
        Route::patch('penyaluran/{penyaluran}', 'update')->name('penyaluran.update');
        Route::delete('penyaluran/{penyaluran}', 'destroy')->name('penyaluran.destroy');
    });

    // --- Manajemen Periode ---
    Route::resource('periode', PeriodeController::class);

    // --- Manajemen Transaksi (dari sisi Admin) ---
    Route::get('transaksi-export-excel', [TransaksiAdminController::class, 'exportExcel'])->name('transaksi.export.excel');
    Route::get('transaksi-export-pdf', [TransaksiAdminController::class, 'exportPdf'])->name('transaksi.export.pdf');
    Route::resource('transaksi', TransaksiAdminController::class)->only(['index', 'show', 'update']);

    // --- Manajemen Program ---
    Route::resource('programs', ProgramController::class)->except(['show']);

    // --- Manajemen Kontak Masuk ---
    Route::resource('kontak', ContactControllerAdmin::class)->only(['index', 'show', 'destroy']);

    // --- Laporan Penyaluran ---
    Route::controller(LaporanPenyaluranController::class)->prefix('laporan-penyaluran')->name('laporan.penyaluran')->group(function () {
        Route::get('/', 'index');
        Route::get('/export-excel', 'exportExcel')->name('.export.excel');
        Route::get('/export-pdf', 'exportPdf')->name('.export.pdf');
    });

    // --- Pengaturan Aplikasi ---
    Route::prefix('settings')->name('settings.')->group(function () {
        // Pengaturan Umum & Alokasi Dana
        Route::controller(SettingController::class)->group(function () {
            Route::get('/general', 'edit')->name('general.edit');
            Route::patch('/general', 'update')->name('general.update');
            Route::get('/payment-accounts', 'paymentEdit')->name('payment.edit');
            Route::patch('/payment-accounts', 'paymentUpdate')->name('payment.update');
        });

        // Manajemen Jenis Zakat
        Route::resource('zakat-types', ZakatTypeController::class)->except(['show']);

        // Manajemen Akun Admin
        Route::resource('admins', AdminController::class)->except(['show']);
    });
});


/*
|--------------------------------------------------------------------------
| FILE RUTE BAWAAN LARAVEL
|--------------------------------------------------------------------------
| Memuat file rute untuk fungsionalitas autentikasi.
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';