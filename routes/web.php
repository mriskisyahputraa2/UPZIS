<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MustahikController;
use App\Http\Controllers\Admin\PermohonanController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\PermohonanBantuanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


/*
|--------------------------------------------------------------------------
| HALAMAN PUBLIK (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/
// Halaman Beranda
Route::get('/', [HomePageController::class, "index"])->name('home');

// Halaman Ajukan Bantuan
Route::get('ajukan-bantuan', [PermohonanBantuanController::class, "create"])->name('permohonan.create');
Route::post('ajukan-bantuan', [PermohonanBantuanController::class, "store"])->name('permohonan.store'); // Menambahkan rute POST


/*
|--------------------------------------------------------------------------
| DASHBOARD PENGGUNA (Untuk Muzakki)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Ini adalah dashboard untuk Muzakki
        return Inertia::render('dashboard');
    })->name('dashboard');
});


/*
|--------------------------------------------------------------------------
| AREA ADMIN & SUPERADMIN (Fitur Baru)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin,superadmin'])->prefix('admin')->name('admin.')->group(function () {

    // Rute untuk Manajemen Mustahik (CRUD)
    Route::resource('mustahiks', MustahikController::class);

    // Rute ini untuk menampilkan daftar permohonan, detail, dan mengubah statusnya.
    Route::resource('permohonan', PermohonanController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::post('permohonan/bulk-update-status', [PermohonanController::class, 'bulkUpdateStatus'])->name('permohonan.bulkUpdateStatus');
});


/*
|--------------------------------------------------------------------------
| FILE RUTE BAWAAN
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
