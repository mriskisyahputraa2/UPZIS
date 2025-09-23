<?php

namespace App\Http\Controllers;

use App\Models\Mustahik;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;

class HomePageController extends Controller
{
    public function index(){
        $muzakkiCount = User::where('role', 'muzakki')->count();
        $mustahikCount = Mustahik::count();

        // Kirim data ke komponen React sebagai props
        return Inertia::render('user/home/homepage', [
            'muzakkiCount' => $muzakkiCount,
            'mustahikCount' => $mustahikCount,
        ]);
    }
}
