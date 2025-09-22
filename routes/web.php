<?php

use App\Http\Controllers\HomePageController;
use App\Http\Controllers\PermohonanBantuanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// Route::get('/', function () {
//     return Inertia::render('welcome');
/// })->name('home');


/*
// HALAMAN PUBLIK
*/
// Halaman Beranda
Route::get('/', [HomePageController::class, "index"])->name('home');

// Halaman Ajukan Bantuan
Route::get('ajukan-bantuan', [PermohonanBantuanController::class, "create"])->name('permohonan.create');




Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
