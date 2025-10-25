<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Transaksi</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0; font-size: 14px; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .currency { text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Transaksi</h1>
        <p>Dicetak pada: {{ now()->translatedFormat('d F Y, H:i') }} WIB</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Order ID</th>
                <th>Nama Muzakki</th>
                <th>Jenis</th>
                <th>Metode</th>
                <th>Jumlah (Rp)</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transaksis as $index => $transaksi)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $transaksi->order_id }}</td>
                    <td>{{ $transaksi->user->name ?? 'N/A' }}</td>
                    <td>{{ ucfirst($transaksi->type) }}</td>
                    <td>{{ $transaksi->payment_method }}</td>
                    <td class="currency">{{ number_format($transaksi->final_amount, 0, ',', '.') }}</td>
                    <td>{{ $transaksi->status }}</td>
                    <td>{{ $transaksi->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d M Y, H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
