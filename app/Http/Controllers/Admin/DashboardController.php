<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
     public function index()
    {
        // Arahkan ke view dashboard admin yang benar
        return Inertia::render('admin/dashboard');
    }
}
