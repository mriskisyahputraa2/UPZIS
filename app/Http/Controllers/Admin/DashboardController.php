<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use App\Models\Permohonan;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan halaman dashboard admin dengan data statistik.
     */
    public function index(Request $request)
    {
        // Validasi input filter periode dari request
        $request->validate([
            'period' => 'in:today,week,month,year,all,custom',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        // Atur filter default ke 'all' (semua waktu) jika tidak ada input
        $period = $request->input('period', 'all');

        // Query dasar untuk semua transaksi yang statusnya "Berhasil"
        $baseQuery = Transaksi::where('status', 'Berhasil');

        // Prioritaskan filter rentang tanggal kustom jika ada
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();
            $baseQuery->whereBetween('created_at', [$startDate, $endDate]);
        }
        // Jika tidak, gunakan filter periode preset
        elseif ($period !== 'all') {
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
            $endDate = $now;
            $baseQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Hitung total dana terkumpul berdasarkan query yang sudah difilter
        $totalDanaTerkumpul = (clone $baseQuery)->sum('final_amount');

        // Hitung rincian dana per metode pembayaran berdasarkan query yang sudah difilter
        $danaPerMetode = (clone $baseQuery)->groupBy('payment_method')->selectRaw('payment_method, sum(final_amount) as total')->pluck('total', 'payment_method');

        // Statistik lainnya (ini tidak terpengaruh oleh filter waktu)
        $danaMenungguVerifikasi = Transaksi::where('status', 'Menunggu Verifikasi')->sum('final_amount');
        $transaksiBaru = Transaksi::where('status', 'Menunggu Verifikasi')->count();
        $permohonanBaru = Permohonan::where('status', 'Baru')->count();
        $totalMustahikDisetujui = Permohonan::where('status', 'Disetujui')->count();
        $activePeriode = Periode::where('status', 'Aktif')->first();

        // Kirim semua data ke view Inertia
        return Inertia::render('admin/dashboard/index', [
            'stats' => [
                'totalDanaTerkumpul' => $totalDanaTerkumpul,
                'danaPerMetode' => [
                    'DANA' => $danaPerMetode->get('DANA', 0),
                    'GoPay' => $danaPerMetode->get('GoPay', 0),
                    'Tunai' => $danaPerMetode->get('Tunai', 0),
                ],
                'danaMenungguVerifikasi' => $danaMenungguVerifikasi,
                'transaksiBaru' => $transaksiBaru,
                'permohonanBaru' => $permohonanBaru,
                'totalMustahikDisetujui' => $totalMustahikDisetujui,
            ],
            'activeFilters' => [
                // Kirim semua filter aktif
                'period' => $period,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'activePeriode' => $activePeriode,
        ]);
    }
}
