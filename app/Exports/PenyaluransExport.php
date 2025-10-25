<?php

namespace App\Exports;

use App\Models\Penyaluran;
use App\Models\Periode;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PenyaluransExport implements FromQuery, WithHeadings, WithMapping
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Menggunakan kembali logika query dari LaporanPenyaluranController
     */
    public function query()
    {
        $request = $this->request;
        return Penyaluran::with(['permohonan.mustahik', 'admin:id,name'])
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('permohonan.mustahik', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($request->input('kategori_pemohon'), function ($query, $kategori) {
                $query->whereHas('permohonan', function ($q) use ($kategori) {
                    $q->where('kategori_pemohon', $kategori);
                });
            })
            ->when($request->input('periode_id'), function ($query, $periodeId) {
                $query->whereHas('permohonan', function ($q) use ($periodeId) {
                    $q->where('periode_id', $periodeId);
                });
            })
            ->when($request->input('kategori_alokasi'), function ($query, $kategori) {
                $query->where('kategori_alokasi', $kategori);
            })
            ->when($request->filled('start_date') && $request->filled('end_date'), function ($query) use ($request) {
                $startDate = Carbon::parse($request->start_date)->startOfDay();
                $endDate = Carbon::parse($request->end_date)->endOfDay();
                $query->whereBetween('distribution_date', [$startDate, $endDate]);
            })
            ->latest('distribution_date');
    }

    /**
     * Mendefinisikan judul kolom
     */
    public function headings(): array
    {
        return [
            'Tanggal Penyaluran',
            'Nama Penerima',
            'Kategori Penerima',
            'Jumlah (Rp)',
            'Sumber Dana',
            'Dicatat Oleh',
            'Catatan',
        ];
    }

    /**
     * Memetakan data untuk setiap baris
     * Di sinilah kita menambahkan logika untuk tanda strip (-)
     */
    public function map($penyaluran): array
    {
        // ## PERUBAHAN UTAMA DI SINI ##

        // Ambil data dengan fallback '-' jika relasi atau properti tidak ada
        $kategoriPenerimaRaw = $penyaluran->permohonan->kategori_pemohon ?? null;
        $kategoriPenerima = $kategoriPenerimaRaw === 'mahasiswa' ? 'Mahasiswa' : ($kategoriPenerimaRaw === 'umum' ? 'Fakir/Miskin' : '-');

        $sumberDanaRaw = $penyaluran->kategori_alokasi;
        $sumberDana = '-';
        if ($sumberDanaRaw === 'kampus') {
            $sumberDana = 'Zakat (Kampus)';
        } elseif ($sumberDanaRaw === 'fakir_miskin') {
            $sumberDana = 'Zakat (Fakir Miskin)';
        } elseif ($sumberDanaRaw) {
            $sumberDana = ucfirst($sumberDanaRaw);
        }

        return [
            $penyaluran->distribution_date ?? '-',
            $penyaluran->permohonan->mustahik->name ?? '-',
            $kategoriPenerima,
            $penyaluran->amount ?? 0, // Jika jumlah null, anggap 0
            $sumberDana,
            $penyaluran->admin->name ?? '-',
            $penyaluran->notes ?? '-',
        ];
    }
}
