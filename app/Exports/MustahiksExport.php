<?php

namespace App\Exports;

use App\Models\Mustahik;
use App\Models\Periode;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MustahiksExport implements FromQuery, WithHeadings, WithMapping
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Menggunakan kembali logika query dari MustahikController@index
     */
    public function query()
    {
        $request = $this->request;
        $query = Mustahik::query()->with('latestPermohonan');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
            });
        }
        if ($request->filled('jenis_kelamin')) {
            $query->where('jenis_kelamin', $request->input('jenis_kelamin'));
        }
        if ($request->filled('kategori_pemohon')) {
            $kategori = $request->input('kategori_pemohon');
            $query->whereHas('latestPermohonan', function ($q) use ($kategori) {
                $q->where('kategori_pemohon', $kategori);
            });
        }
        if ($request->filled('periode_id')) {
            $periode_id = $request->input('periode_id');
            $query->whereHas('permohonans', function ($q) use ($periode_id) {
                $q->where('periode_id', $periode_id);
            });
        }

        return $query->latest();
    }

    /**
     * Mendefinisikan judul kolom
     */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NIK',
            'No. KK',
            'No. Telepon',
            'Alamat',
            'Jenis Kelamin',
            'Kategori',
            'Pekerjaan',
            'Jumlah Tanggungan',
            'Status Rumah',
        ];
    }

    /**
     * Memetakan data untuk setiap baris
     */
    public function map($mustahik): array
    {
      return [
            $mustahik->name ?? '-',
            "'" . ($mustahik->nik ?? '-'), // Tanda ' untuk mencegah format angka otomatis di Excel
            "'" . ($mustahik->kk_number ?? '-'),
            $mustahik->phone_number ?? '-',
            $mustahik->address ?? '-',
            $mustahik->jenis_kelamin ?? '-',
            ucfirst($mustahik->latestPermohonan->kategori_pemohon ?? '-'),
            $mustahik->pekerjaan ?? '-',
            $mustahik->jumlah_tanggungan ?? '-', // Akan menampilkan '0' jika nilainya 0, dan '-' jika null
            $mustahik->status_rumah ?? '-',
        ];
    }
}
