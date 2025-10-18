<?php

namespace App\Http\Controllers;

use App\Models\Mustahik;
use App\Models\Permohonan;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;

class HomePageController extends Controller
{
    public function index(){
       $muzakkiCount = Transaksi::where('status', 'Berhasil')
                                   ->distinct('user_id')
                                   ->count('user_id');
    //    $mustahikCount = Mustahik::count();
    $mustahikCount = Permohonan::where('status', 'Disetujui')->count();

        // Kirim data ke komponen React sebagai props
        return Inertia::render('user/home/homepage', [
            'muzakkiCount' => $muzakkiCount,
            'mustahikCount' => $mustahikCount,
        ]);
    }
}
