<?php

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
use App\Http\Controllers\StrukturOrganisasiController;
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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| HALAMAN PUBLIK (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/

// Halaman Beranda
Route::get('/', [HomePageController::class, 'index'])->name('home');

// Route Halaman Struktur Organisasi
Route::get('struktur-organisasi', [StrukturOrganisasiController::class, 'index'])->name('struktur-organisasi.index');

// Halaman Ajukan Bantuan
Route::get('ajukan-bantuan', [PermohonanBantuanController::class, 'create'])->name('permohonan.create');
Route::post('ajukan-bantuan', [PermohonanBantuanController::class, 'store'])->name('permohonan.store');
Route::get('pendaftaran-berhasil', [PermohonanBantuanController::class, 'success'])->name('permohonan.success');
Route::get('lacak-status', [PermohonanBantuanController::class, 'lacak'])->name('permohonan.lacak');
// Rute untuk menampilkan halaman kalkulator
Route::get('kalkulator-zakat', [KalkulatorController::class, 'index'])->name('kalkulator.index');
Route::post('kalkulator-zakat/hitung', [KalkulatorController::class, 'hitung'])->name('kalkulator.hitung');

// Route untuk Galeri Program Publik
Route::get('galeri', [GaleriController::class, 'index'])->name('galeri.index');
Route::get('galeri/{program}', [GaleriController::class, 'show'])->name('galeri.show');

// Route Untuk Kontak
Route::get('kontak', [ContactController::class, 'index'])->name('kontak.index');
Route::post('kontak', [ContactController::class, 'store'])
    ->name('kontak.store')
    ->middleware('throttle:1,1');
/*
|--------------------------------------------------------------------------
| ROUTE PENGGUNA (Untuk Muzakki)
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
    | Halaman Transaksi Pengguna (Zakat, Infaq, Sedekah)
    |--------------------------------------------------------------------------
    */
    Route::get('donasi', [TransaksiController::class, 'selectDonationType'])->name('donasi.select');
    Route::get('donasi/zakat', [TransaksiController::class, 'create'])->name('donasi.create.zakat');
    Route::get('donasi/{type}', [TransaksiController::class, 'createInfaqSedekah'])
        ->name('donasi.create.other')
        ->where('type', 'infaq|sedekah');
    Route::post('donasi', [TransaksiController::class, 'store'])->name('donasi.store');
    Route::get('transaksi/{order_id}', [TransaksiController::class, 'show'])->name('transaksi.show');
    Route::post('transaksi/{order_id}/upload', [TransaksiController::class, 'uploadProof'])->name('transaksi.upload');
});

/*
|--------------------------------------------------------------------------
| ROUTE ADMIN & SUPERADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin,superadmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Manajemen Dashboard
        Route::get('dashboard', [DashboardController::class, 'index']);

        // Route Halaman Struktur Organisasi Admin
        Route::get('struktur-organisasi', [AdminStrukturOrganisasiController::class, 'edit'])->name('struktur-organisasi.edit');
        Route::post('struktur-organisasi', [AdminStrukturOrganisasiController::class, 'update'])->name('struktur-organisasi.update');

        // Manajemen Mustahik
        Route::resource('mustahiks', MustahikController::class);

        Route::get('mustahiks-export-excel', [MustahikController::class, 'exportExcel'])->name('mustahiks.export.excel');
        Route::get('mustahiks-export-pdf', [MustahikController::class, 'exportPdf'])->name('mustahiks.export.pdf');

        // Manajemen Permohonan dan Status
        Route::resource('permohonan', PermohonanController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::post('permohonan/bulk-update-status', [PermohonanController::class, 'bulkUpdateStatus'])->name('permohonan.bulkUpdateStatus');

        Route::post('permohonan/{permohonan}/penyaluran', [PenyaluranController::class, 'store'])->name('permohonan.penyaluran.store');

        Route::patch('penyaluran/{penyaluran}', [PenyaluranController::class, 'update'])->name('penyaluran.update');
        Route::delete('penyaluran/{penyaluran}', [PenyaluranController::class, 'destroy'])->name('penyaluran.destroy');
        // Manajemen Periode
        Route::resource('/periode', PeriodeController::class);
        // Manajemen Transaksi
        Route::resource('/transaksi', TransaksiAdminController::class);
        Route::get('/transaksi-export-excel', [TransaksiAdminController::class, 'exportExcel'])->name('transaksi.export.excel');
        Route::get('/transaksi-export-pdf', [TransaksiAdminController::class, 'exportPdf'])->name('transaksi.export.pdf');
        Route::resource('/programs', ProgramController::class)->except(['show']);

        Route::resource('/kontak', ContactControllerAdmin::class)->only(['index', 'show', 'destroy']);

        Route::get('/laporan-penyaluran', [LaporanPenyaluranController::class, 'index'])->name('laporan.penyaluran');
        Route::get('/laporan-penyaluran/export-excel', [LaporanPenyaluranController::class, 'exportExcel'])->name('laporan.penyaluran.export.excel');
        Route::get('/laporan-penyaluran/export-pdf', [LaporanPenyaluranController::class, 'exportPdf'])->name('laporan.penyaluran.export.pdf');

        Route::prefix('settings')
            ->name('settings.')
            ->group(function () {
                // Rute untuk Pengaturan Umum
                Route::get('/general', [SettingController::class, 'edit'])->name('general.edit');
                Route::patch('/general', [SettingController::class, 'update'])->name('general.update');

                // START: RUTE BARU UNTUK AKUN PEMBAYARAN
                Route::get('/payment-accounts', [SettingController::class, 'paymentEdit'])->name('payment.edit');
                Route::patch('/payment-accounts', [SettingController::class, 'paymentUpdate'])->name('payment.update');
                Route::resource('zakat-types', ZakatTypeController::class)->except(['show']);
                Route::resource('admins', AdminController::class)->except(['show']);
            });
    });

/*
|--------------------------------------------------------------------------
| FILE RUTE BAWAAN
|--------------------------------------------------------------------------
*/
// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
