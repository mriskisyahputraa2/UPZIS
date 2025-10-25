<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Data Mustahik</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 9px; color: #333; }
        .header { text-align: center; margin-bottom: 25px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 5px 0; font-size: 11px; color: #555; }

        .filter-section { margin-bottom: 20px; border: 1px solid #eee; padding: 10px; border-radius: 5px; background-color: #f9f9f9; }
        .filter-section h3 { margin-top: 0; margin-bottom: 10px; font-size: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .filter-section span { margin-right: 15px; font-size: 10px; }

        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 5px; text-align: left; word-wrap: break-word; }
        th { background-color: #f2f2f2; font-weight: bold; font-size: 10px; }
        tbody tr:nth-child(even) { background-color: #f9f9f9; }

        .footer-summary { margin-top: 20px; text-align: right; }
        .footer-summary p { margin: 5px 0; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Data Mustahik</h1>
        <p>Unit Pengumpul Zakat, Infaq dan Sedekah (UPZIS) Politeknik Negeri Lhokseumawe</p>
        <p>Dicetak pada: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
    </div>

    @if (!empty($filtersDescription))
        <div class="filter-section">
            <h3>Laporan Dibuat Berdasarkan Filter:</h3>
            @foreach ($filtersDescription as $key => $value)
                <span>{{ $key }}: <strong>{{ $value }}</strong></span>
            @endforeach
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 3%;">No</th>
                <th style="width: 15%;">Nama</th>
                <th style="width: 12%;">NIK</th>
                <th style="width: 15%;">Alamat</th>
                <th style="width: 8%;">Jenis Kelamin</th>
                <th style="width: 8%;">Kategori</th>
                <th style="width: 12%;">Pekerjaan</th>
                <th style="width: 7%;">Tanggungan</th>
                <th style="width: 10%;">Status Rumah</th>
                <th style="width: 10%;">No. Telepon</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($mustahiks as $index => $mustahik)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $mustahik->name }}</td>
                    <td>'{{ $mustahik->nik }}</td>
                    <td>{{ $mustahik->address }}</td>
                    <td>{{ $mustahik->jenis_kelamin }}</td>
                    <td>{{ ucfirst($mustahik->latestPermohonan->kategori_pemohon ?? 'N/A') }}</td>
                    <td>{{ $mustahik->pekerjaan ?? '-' }}</td>
                    <td>{{ $mustahik->jumlah_tanggungan ?? '-' }}</td>
                    <td>{{ $mustahik->status_rumah ?? '-' }}</td>
                    <td>{{ $mustahik->phone_number }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align: center; padding: 20px;">Tidak ada data yang cocok dengan filter yang dipilih.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer-summary">
        <p>Total Mustahik: {{ count($mustahiks) }}</p>
    </div>
</body>
</html>
