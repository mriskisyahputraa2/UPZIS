<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GaleriController extends Controller
{
    /**
     * Menampilkan halaman daftar semua program yang sudah di-publish.
     */
    public function index()
    {
        $programs = Program::where('status', 'Published')
            ->withSum('penyalurans', 'amount')
            ->with('photos')
            ->latest('program_date')
            ->paginate(9); // Tampilkan 9 program per halaman

        return Inertia::render('user/galeri/index', [
            'programs' => $programs,
        ]);
    }

    /**
     * Menampilkan halaman detail dari satu program.
     */
    public function show(Program $program)
    {
        // Pastikan hanya program yang sudah di-publish yang bisa diakses
        if ($program->status !== 'Published') {
            abort(404);
        }

        // Muat semua relasi yang dibutuhkan
        $program->load('photos');
        $program->loadSum('penyalurans', 'amount');
        $program->loadCount('penyalurans');

        return Inertia::render('user/galeri/show', [
            'program' => $program,
        ]);
    }
}
