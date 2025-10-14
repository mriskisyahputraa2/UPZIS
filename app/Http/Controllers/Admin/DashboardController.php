<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'period' => 'in:today,week,month,year,all,custom',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'penyaluran_periode_id' => 'nullable|string',
        ]);

        // --- FILTER UNTUK DANA TERKUMPUL (Berdasarkan Waktu) ---
        $period = $request->input('period', 'all');
        $startDate = null;
        $endDate = Carbon::now();

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();
        } elseif ($period !== 'all') {
            $now = Carbon::now();
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

        $danaTerkumpulQuery = Transaksi::where('status', 'Berhasil');
        if ($startDate) {
            $danaTerkumpulQuery->whereBetween('created_at', [$startDate, $endDate]);
        }
        $totalDanaTerkumpul = (clone $danaTerkumpulQuery)->sum('final_amount');
        $danaPerMetode = (clone $danaTerkumpulQuery)->groupBy('payment_method')->selectRaw('payment_method, sum(final_amount) as total')->pluck('total', 'payment_method');

        // --- FILTER UNTUK DANA DISALURKAN (Berdasarkan Periode) ---
        $penyaluranPeriodeId = $request->input('penyaluran_periode_id', 'all');
        $danaDisalurkanQuery = Penyaluran::query();
        if ($penyaluranPeriodeId !== 'all') {
            $danaDisalurkanQuery->whereHas('permohonan', function ($query) use ($penyaluranPeriodeId) {
                $query->where('periode_id', $penyaluranPeriodeId);
            });
        }
        $totalDanaDisalurkan = $danaDisalurkanQuery->sum('amount');

        // --- DATA LAINNYA ---
        $periodes = Periode::latest()->get();
        $danaMenungguVerifikasi = Transaksi::where('status', 'Menunggu Verifikasi')->sum('final_amount');
        $transaksiBaru = Transaksi::where('status', 'Menunggu Verifikasi')->count();
        $permohonanBaru = Permohonan::where('status', 'Baru')->count();
        $totalMustahikDisetujui = Permohonan::where('status', 'Disetujui')->count();
        $activePeriode = Periode::where('status', 'Aktif')->first();

        // START: TAMBAHAN QUERY UNTUK MUZAKKI TERBARU
        $recentMuzakkis = Transaksi::with('user:id,name')
            // ->where('status', 'Berhasil')
            ->latest()
            ->take(5)
            ->get();
        // END: TAMBAHAN QUERY

        return Inertia::render('admin/dashboard/index', [
            'stats' => [
                'totalDanaTerkumpul' => $totalDanaTerkumpul,
                'totalDanaDisalurkan' => $totalDanaDisalurkan,
                'danaPerMetode' => ['DANA' => $danaPerMetode->get('DANA', 0), 'GoPay' => $danaPerMetode->get('GoPay', 0), 'Tunai' => $danaPerMetode->get('Tunai', 0)],
                'danaMenungguVerifikasi' => $danaMenungguVerifikasi,
                'transaksiBaru' => $transaksiBaru,
                'permohonanBaru' => $permohonanBaru,
                'totalMustahikDisetujui' => $totalMustahikDisetujui,
            ],
            'activeFilters' => [
                'period' => $period,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'penyaluran_periode_id' => $penyaluranPeriodeId,
            ],
            'periodes' => $periodes,
            'activePeriode' => $activePeriode,
            'recentMuzakkis' => $recentMuzakkis,
        ]);
    }
}
