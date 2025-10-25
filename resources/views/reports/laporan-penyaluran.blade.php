<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penyaluran Bantuan</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 9px; color: #333; }
        .header { text-align: center; margin-bottom: 25px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 5px 0; font-size: 11px; color: #555; }
        .filter-section {
            margin-bottom: 15px;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .filter-section strong { font-size: 10px; display: block; margin-bottom: 5px; } /* Block display for the title */
        .filter-section p { /* Changed from span to p for block display */
            margin: 2px 0; /* Adjust margin for spacing between lines */
            font-size: 10px;
            line-height: 1.4; /* Improve readability */
        }
        .filter-section p strong { /* Ensure the value itself is strong */
            font-size: 10px; /* Keep font size consistent */
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 5px; text-align: left; word-wrap: break-word; }
        th { background-color: #f2f2f2; font-weight: bold; font-size: 10px; }
        tbody tr:nth-child(even) { background-color: #f9f9f9; }
        .footer-summary { margin-top: 20px; text-align: right; }
        .footer-summary p { margin: 5px 0; font-size: 12px; font-weight: bold; }
        .currency { text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Penyaluran Bantuan</h1>
        <p>Unit Pengumpul Zakat, Infaq dan Sedekah (UPZIS) Politeknik Negeri Lhokseumawe</p>
        <p>Dicetak pada: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
    </div>

    @if (!empty($filtersDescription))
        <div class="filter-section">
            <strong>Filter Aktif:</strong>
            @foreach ($filtersDescription as $key => $value)
                {{-- ## PERBAIKAN DI SINI: Mengubah dari <span> menjadi <p> untuk membuat setiap filter dalam baris baru ## --}}
                <p>{{ $key }}: <strong>{{ $value }}</strong></p>
            @endforeach
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 3%;">No</th>
                <th style="width: 15%;">Tgl. Penyaluran</th>
                <th style="width: 20%;">Nama Penerima</th>
                <th style="width: 12%;">Kategori</th>
                <th style="width: 15%;">Sumber Dana</th>
                <th style="width: 15%;">Jumlah (Rp)</th>
                <th style="width: 20%;">Dicatat Oleh</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($penyalurans as $index => $penyaluran)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($penyaluran->distribution_date)->translatedFormat('d M Y') }}</td>
                    <td>{{ $penyaluran->permohonan->mustahik->name ?? 'N/A' }}</td>
                    <td>{{ $penyaluran->permohonan->kategori_pemohon === 'mahasiswa' ? 'Mahasiswa' : 'Fakir/Miskin' }}</td>
                    <td>
                        @if($penyaluran->kategori_alokasi == 'kampus') Zakat (Kampus)
                        @elseif($penyaluran->kategori_alokasi == 'fakir_miskin') Zakat (Fakir Miskin)
                        @else {{ ucfirst($penyaluran->kategori_alokasi) }}
                        @endif
                    </td>
                    <td class="currency">{{ number_format($penyaluran->amount, 0, ',', '.') }}</td>
                    <td>{{ $penyaluran->admin->name ?? 'N/A' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;">Tidak ada data yang cocok dengan filter.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer-summary">
        <p>Total Penyaluran: Rp {{ number_format($summary['totalAmount'], 0, ',', '.') }}</p>
        <p>Jumlah Mustahik Terbantu: {{ $summary['jumlahMustahikTerbantu'] }} Orang</p>
    </div>
</body>
</html>
