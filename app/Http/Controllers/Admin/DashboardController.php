<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Permohonan;
use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Program;
use App\Models\Setting;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'periode_id' => 'nullable|string',
            'period' => 'in:today,week,month,year,all,custom',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'payment_method' => 'nullable|string|in:DANA,GoPay,Tunai',
        ]);

        // ==================================================================
        // ## 1. DATA REAL-TIME (Data Sepanjang Masa untuk Ringkasan) ##
        // ==================================================================

        $alokasiPersen = (float) Setting::where('setting_key', 'alokasi_fakir_miskin_persen')->value('setting_value') ?: 10;
        $persenFakirMiskin = $alokasiPersen / 100;
        $persenKampus = 1 - $persenFakirMiskin;

        $totalDanaZakat = Transaksi::where('status', 'Berhasil')->where('type', 'zakat')->sum('final_amount');
        $totalInfaqTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'infaq')->sum('final_amount');
        $totalSedekahTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'sedekah')->sum('final_amount');

        $penyaluranFakirMiskin = Penyaluran::where('kategori_alokasi', 'fakir_miskin')->sum('amount');
        $penyaluranKampus = Penyaluran::where('kategori_alokasi', 'kampus')->sum('amount');
        $penyaluranInfaq = Penyaluran::where('kategori_alokasi', 'infaq')->sum('amount');
        $penyaluranSedekah = Penyaluran::where('kategori_alokasi', 'sedekah')->sum('amount');

        $realtimeStats = [
            'sisaDanaKampus' => $totalDanaZakat * $persenKampus - $penyaluranKampus,
            'sisaDanaFakirMiskin' => $totalDanaZakat * $persenFakirMiskin - $penyaluranFakirMiskin,
            'sisaDanaInfaq' => $totalInfaqTerkumpul - $penyaluranInfaq,
            'sisaDanaSedekah' => $totalSedekahTerkumpul - $penyaluranSedekah,
            'transaksiBaru' => Transaksi::where('status', 'Menunggu Verifikasi')->count(),
            'danaMenungguVerifikasi' => Transaksi::where('status', 'Menunggu Verifikasi')->sum('final_amount'),
            'permohonanBaru' => Permohonan::where('status', 'Baru')->count(),
            'recentMuzakkis' => Transaksi::with('user:id,name')->latest()->take(5)->get(),

            // ## STATISTIK BARU UNTUK KARTU KINERJA & TUGAS ##
            'pesanBaru' => Contact::where('status', 'Baru')->count(),
            'programPublished' => Program::where('status', 'Published')->count(),
            'totalMustahikDisetujui' => Permohonan::where('status', 'Disetujui')->distinct('mustahik_id')->count('mustahik_id'),
        ];

        // ================================================================
        // ## 2. DATA PERFORMA (Dinamis Berdasarkan Filter) ##
        // ================================================================

        $danaMasukQuery = Transaksi::where('status', 'Berhasil');
        $danaDisalurkanQuery = Penyaluran::query();

        $startDate = null;
        $endDate = null;

        if ($request->filled('periode_id') && $request->input('periode_id') !== 'all') {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $startDate = Carbon::parse($periode->start_date)->startOfDay();
                $endDate = Carbon::parse($periode->end_date)->endOfDay();
            }
        } else {
            $period = $request->input('period', 'today');
            $now = Carbon::now();
            $endDate = $now->copy()->endOfDay();

            if ($request->filled('start_date') && $request->filled('end_date')) {
                $startDate = Carbon::parse($request->start_date)->startOfDay();
                $endDate = Carbon::parse($request->end_date)->endOfDay();
            } elseif ($period !== 'all') {
                switch ($period) {
                    case 'today':
                        $startDate = $now->copy()->startOfDay();
                        break;
                    case 'week':
                        $startDate = $now->copy()->startOfWeek();
                        break;
                    case 'month':
                        $startDate = $now->copy()->startOfMonth();
                        break;
                    case 'year':
                        $startDate = $now->copy()->startOfYear();
                        break;
                }
            }
        }

        if ($startDate && $endDate) {
            $danaMasukQuery->whereBetween('created_at', [$startDate, $endDate]);
            $danaDisalurkanQuery->whereBetween('distribution_date', [$startDate, $endDate]);
        }

        if ($request->filled('payment_method')) {
            $danaMasukQuery->where('payment_method', $request->input('payment_method'));
        }

        $performanceStats = [
            'danaTerkumpul' => [
                'zakat' => (float) (clone $danaMasukQuery)->where('type', 'zakat')->sum('final_amount'),
                'infaq' => (float) (clone $danaMasukQuery)->where('type', 'infaq')->sum('final_amount'),
                'sedekah' => (float) (clone $danaMasukQuery)->where('type', 'sedekah')->sum('final_amount'),
                'total' => (float) (clone $danaMasukQuery)->sum('final_amount'),
            ],
            'danaDisalurkan' => [
                'kampus' => (float) (clone $danaDisalurkanQuery)->where('kategori_alokasi', 'kampus')->sum('amount'),
                'fakir_miskin' => (float) (clone $danaDisalurkanQuery)->where('kategori_alokasi', 'fakir_miskin')->sum('amount'),
                'infaq' => (float) (clone $danaDisalurkanQuery)->where('kategori_alokasi', 'infaq')->sum('amount'),
                'sedekah' => (float) (clone $danaDisalurkanQuery)->where('kategori_alokasi', 'sedekah')->sum('amount'),
                'total' => (float) (clone $danaDisalurkanQuery)->sum('amount'),
            ],
        ];

        $activeFilters = $request->only(['periode_id', 'period', 'start_date', 'end_date', 'payment_method']);
        if (!$request->has('period') && !$request->has('periode_id') && !$request->has('start_date')) {
            $activeFilters['period'] = 'today';
        }

        return Inertia::render('admin/dashboard/index', [
            'realtimeStats' => $realtimeStats,
            'performanceStats' => $performanceStats,
            'activeFilters' => $activeFilters,
            'periodes' => Periode::latest()->get(['id', 'name']),
            'activePeriode' => Periode::where('status', 'Aktif')->first(),
            // 'alokasiPersentase' => [
            //     'fakir_miskin' => $alokasiPersen,
            //     'kampus' => 100 - $alokasiPersen,
            // ],
            'alokasiAturan' => [
                'kampus' => [
                    'persen' => 100 - $alokasiPersen,
                    'total_alokasi' => $totalDanaZakat * $persenKampus,
                ],
                'fakir_miskin' => [
                    'persen' => $alokasiPersen,
                    'total_alokasi' => $totalDanaZakat * $persenFakirMiskin,
                ],
            ],
        ]);
    }
}
