<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PermohonanBantuanController extends Controller
{
    // Tampilan Permohonan Bantuan Mustahik
    public function create(){
        return Inertia::render('user/permohonan/create');
    }

    // Proses pengajuan bantuan mustahik
    public function store(Request $request){
        // Validasi input
        // $validated =
    }
}
