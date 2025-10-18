import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Banknote,
    Calendar,
    CircleUserRound,
    FileText,
    Mail,
    Phone,
    Receipt,
    Wallet,
} from 'lucide-react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'Berhasil':
            return 'success';
        case 'Menunggu Verifikasi':
            return 'warning';
        case 'Menunggu Pembayaran':
            return 'info'; // Mengubah ini agar lebih konsisten
        case 'Gagal':
        case 'Kadaluarsa':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const DetailItem = ({ icon: Icon, label, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="flex items-center text-sm font-medium text-muted-foreground">
            <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{label}</span>
        </dt>
        <dd className="mt-1 font-semibold break-words text-foreground sm:col-span-2 sm:mt-0">
            {children || '-'}
        </dd>
    </div>
);

// ## PERUBAHAN 2: Tambahkan helper component untuk Badge Jenis Donasi ##
const DonationTypeBadge = ({ type }) => {
    if (!type) {
        // Fallback untuk data lama yang mungkin belum punya 'type'
        // atau jika transaksi adalah zakat (default)
        return <Badge variant="success">Zakat</Badge>;
    }
    const typeName = type.charAt(0).toUpperCase() + type.slice(1);
    let variant: 'success' | 'info' | 'secondary' = 'secondary';
    if (type === 'zakat') variant = 'success';
    if (type === 'infaq') variant = 'info';
    // 'sedekah' akan menggunakan 'secondary' (abu-abu)

    return <Badge variant={variant}>{typeName}</Badge>;
};

export default function TransactionInfoPanel({ transaksi }) {
    return (
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Informasi Muzakki</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    <DetailItem icon={CircleUserRound} label="Nama">
                        {transaksi.user.name}
                    </DetailItem>
                    <DetailItem icon={Mail} label="Email">
                        {transaksi.user.email}
                    </DetailItem>
                    <DetailItem icon={Phone} label="No. Telepon">
                        {transaksi.user.phone_number}
                    </DetailItem>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Detail Transaksi</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    <DetailItem icon={Receipt} label="Order ID">
                        {transaksi.order_id}
                    </DetailItem>

                    {/* ## PERUBAHAN 3: Tambahkan baris 'Jenis Donasi' di sini ## */}
                    <DetailItem icon={FileText} label="Jenis Donasi">
                        <DonationTypeBadge type={transaksi.type} />
                    </DetailItem>

                    <DetailItem icon={Calendar} label="Tanggal">
                        <div className="flex flex-col">
                            <span>{transaksi.formatted_date}</span>
                            <span className="text-sm font-normal text-green-600">
                                {transaksi.formatted_time}
                            </span>
                        </div>
                    </DetailItem>
                    <DetailItem icon={Banknote} label="Jumlah">
                        {formatCurrency(transaksi.final_amount)}
                    </DetailItem>
                    <DetailItem icon={Wallet} label="Metode">
                        {transaksi.payment_method}
                    </DetailItem>
                    <div className="flex items-center justify-between py-3">
                        <dt className="flex items-center text-sm font-medium text-muted-foreground">
                            Status
                        </dt>
                        <dd>
                            <Badge
                                variant={getStatusBadgeVariant(
                                    transaksi.status,
                                )}
                            >
                                {transaksi.status}
                            </Badge>
                        </dd>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
