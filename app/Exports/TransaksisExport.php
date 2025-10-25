<?php

namespace App\Exports;

use App\Models\Periode;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class TransaksisExport implements FromQuery, WithHeadings, WithMapping
{
    protected $request;

    /**
     * Kita simpan request-nya agar bisa mengakses filter
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Ini adalah query utama.
     * Kita salin-tempel logika filter yang SAMA PERSIS
     * dari TransaksiAdminController@index.
     */
    public function query()
    {
        $request = $this->request;
        $query = Transaksi::with('user'); // Muat relasi user

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $startDate = Carbon::parse($periode->start_date)->startOfDay();
                $endDate = Carbon::parse($periode->end_date)->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
        }

        return $query->latest(); // Kembalikan query-nya
    }

    /**
     * Tentukan judul untuk setiap kolom di file Excel.
     */
    public function headings(): array
    {
        return [
            'Order ID',
            'Nama Muzakki',
            'Email Muzakki',
            'Jenis Donasi',
            'Metode Pembayaran',
            'Jumlah (Rp)',
            'Status',
            'Tanggal Transaksi',
        ];
    }

    /**
     * Tentukan data apa yang akan diisi di setiap baris.
     */
    public function map($transaksi): array
    {
        return [
            $transaksi->order_id,
            $transaksi->user->name ?? 'N/A',
            $transaksi->user->email ?? 'N/A',
            ucfirst($transaksi->type), // 'zakat' -> 'Zakat'
            $transaksi->payment_method,
            $transaksi->final_amount,
            $transaksi->status,
            $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d F Y, H:i'),
        ];
    }
}
