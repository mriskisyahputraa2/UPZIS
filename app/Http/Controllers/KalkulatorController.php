<?php

namespace App\Http\Controllers;

use App\Models\JenisZakat;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class KalkulatorController extends Controller
{
    /**
     * Menampilkan halaman kalkulator zakat.
     */
    public function index()
    {
        // Ambil semua jenis zakat yang aktif
        $jenisZakat = JenisZakat::where('status', 'Aktif')->get();

        // Ambil harga emas dari settings (dengan caching untuk performa)
        $hargaEmas = Cache::remember('harga_emas_per_gram', 60, function () {
            return Setting::where('setting_key', 'harga_emas_per_gram')->value('setting_value');
        });

        return Inertia::render('user/kalkulator/index', [
            'jenisZakat' => $jenisZakat,
            'hargaEmas' => (float) $hargaEmas,
        ]);
    }

    /**
     * Menghitung hasil zakat berdasarkan input pengguna.
     */
    public function hitung(Request $request)
    {
        $request->validate([
            'jenis_zakat_id' => 'required|exists:jenis_zakat,id',
            'pendapatan_pokok' => 'required|numeric|min:0',
            'pendapatan_lain' => 'nullable|numeric|min:0',
            'hutang_cicilan' => 'nullable|numeric|min:0',
        ]);

        $jenisZakat = JenisZakat::find($request->jenis_zakat_id);
        $hargaEmas = (float) Cache::remember('harga_emas_per_gram', 60, function () {
            return Setting::where('setting_key', 'harga_emas_per_gram')->value('setting_value');
        });

        $nominalZakat = 0;
        $wajibZakat = false;
        $nisab = 0;
        $pendapatanBersih = 0;

        if (str_contains(strtolower($jenisZakat->name), 'profesi')) {
            $pendapatanPokok = (float) $request->pendapatan_pokok;
            $pendapatanLain = (float) $request->pendapatan_lain;
            $hutangCicilan = (float) $request->hutang_cicilan;

            $pendapatanBersih = $pendapatanPokok + $pendapatanLain - $hutangCicilan;

            $nisabTahunan = $jenisZakat->nisab_quantity * $hargaEmas;
            $nisabBulanan = $nisabTahunan / 12;
            $nisab = $nisabBulanan;

            if ($pendapatanBersih >= $nisabBulanan) {
                $wajibZakat = true;
                // Zakat dihitung dari pendapatan bersih bulanan
                $nominalZakat = ($jenisZakat->rate_percent / 100) * $pendapatanBersih;
            }
        } else {
            // Logika untuk Zakat Maal lainnya (sudah benar)
            $nilaiHarta = (float) $request->pendapatan_pokok;
            $nisab = $jenisZakat->nisab_quantity * $hargaEmas; // Nisab tahunan
            $pendapatanBersih = $nilaiHarta;

            if ($nilaiHarta >= $nisab) {
                $wajibZakat = true;
                $nominalZakat = ($jenisZakat->rate_percent / 100) * $nilaiHarta;
            }
        }

        return response()->json([
            'nisab' => $nisab,
            'pendapatan_bersih' => $pendapatanBersih,
            'wajib_zakat' => $wajibZakat,
            'nominal_zakat' => $nominalZakat < 0 ? 0 : $nominalZakat,
        ]);
    }
}
