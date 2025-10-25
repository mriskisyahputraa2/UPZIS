<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Transaksi</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; }
        .header { text-align: center; margin-bottom: 25px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 5px 0; font-size: 12px; color: #555; }

        .filter-section { margin-bottom: 20px; border: 1px solid #eee; padding: 10px; border-radius: 5px; }
        .filter-section h3 { margin-top: 0; margin-bottom: 10px; font-size: 14px; }
        .filter-section p { margin: 0; line-height: 1.6; }

        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; font-size: 11px; }
        tbody tr:nth-child(even) { background-color: #f9f9f9; }

        .currency { text-align: right; }
        .footer-summary { margin-top: 20px; text-align: right; }
        .footer-summary p { margin: 5px 0; font-size: 12px; }
        .footer-summary .total { font-weight: bold; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Transaksi Donasi</h1>
        <p>Unit Pengumpul Zakat, Infaq dan Sedekah (UPZIS) Politeknik Negeri Lhokseumawe</p>
        <p>Dicetak pada: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
    </div>

    @if (!empty($filtersDescription))
        <div class="filter-section">
            <h3>Laporan Dibuat Berdasarkan Filter:</h3>
            @foreach ($filtersDescription as $key => $value)
                <p><strong>{{ $key }}:</strong> {{ $value }}</p>
            @endforeach
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 20%;">Nama Muzakki</th>
                <th style="width: 10%;">Jenis</th>
                <th style="width: 10%;">Metode</th>
                <th style="width: 15%;">Jumlah (Rp)</th>
                <th style="width: 15%;">Status</th>
                <th style="width: 25%;">Tanggal Transaksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($transaksis as $index => $transaksi)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $transaksi->user->name ?? 'N/A' }}</td>
                    <td>{{ ucfirst($transaksi->type) }}</td>
                    <td>{{ $transaksi->payment_method }}</td>
                    <td class="currency">{{ number_format($transaksi->final_amount, 0, ',', '.') }}</td>
                    <td>{{ $transaksi->status }}</td>
                    <td>{{ $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d M Y, H:i') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;">Tidak ada data yang cocok dengan filter yang dipilih.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer-summary">
        <p>Total Transaksi: <strong>{{ $summary['totalTransactions'] }}</strong></p>
        <p class="total">Total Dana Terkumpul: Rp {{ number_format($summary['totalAmount'], 0, ',', '.') }}</p>
    </div>
</body>
</html>
