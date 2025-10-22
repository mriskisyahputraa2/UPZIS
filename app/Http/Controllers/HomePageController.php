<?php

namespace App\Http\Controllers;

use App\Models\Mustahik;
use App\Models\Permohonan;
use App\Models\Program;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;

class HomePageController extends Controller
{
    public function index()
    {
        $muzakkiCount = Transaksi::where('status', 'Berhasil')->distinct('user_id')->count('user_id');
        $mustahikCount = Permohonan::where('status', 'Disetujui')->count();

        //Ambil 3 program terbaru yang sudah di-publish
        $programs = Program::where('status', 'Published')
            ->withSum('penyalurans', 'amount') // Hitung total dana
            ->with('photos') // Ambil foto-fotonya
            ->latest('program_date') // Urutkan berdasarkan tanggal program
            ->take(3)
            ->get();

        // Kirim data ke komponen React sebagai props
        return Inertia::render('user/home/homepage', [
            'muzakkiCount' => $muzakkiCount,
            'mustahikCount' => $mustahikCount,
            'programs' => $programs,
        ]);
    }
}
