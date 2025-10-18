import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
// ## PERUBAHAN 1: Import komponen Pagination dari shadcn/ui ##
import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Helper Functions
const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const getStatusInfo = (status) => {
    switch (status) {
        case 'Berhasil':
            return { variant: 'success', icon: CheckCircle, label: 'Berhasil' };
        case 'Menunggu Verifikasi':
            return { variant: 'warning', icon: Clock, label: 'Verifikasi' };
        case 'Menunggu Pembayaran':
            return { variant: 'info', icon: Wallet, label: 'Pembayaran' };
        case 'Gagal':
        case 'Kadaluarsa':
            return { variant: 'destructive', icon: XCircle, label: 'Gagal' };
        default:
            return { variant: 'secondary', icon: FileText, label: status };
    }
};

const DonationTypeBadge = ({ type }) => {
    if (!type) {
        return <Badge variant="success">Zakat</Badge>;
    }
    const typeName = type.charAt(0).toUpperCase() + type.slice(1);
    let variant: 'success' | 'info' | 'secondary' = 'secondary';
    if (type === 'zakat') variant = 'success';
    if (type === 'infaq') variant = 'info';

    return <Badge variant={variant}>{typeName}</Badge>;
};

// ## PERUBAHAN 2: Hapus komponen Pagination lama yang sederhana ##

const statusFilters = [
    'Semua',
    'Berhasil',
    'Menunggu Verifikasi',
    'Menunggu Pembayaran',
    'Gagal',
];

export default function TransactionHistory({ transactions, className = '' }) {
    const [filter, setFilter] = useState('Semua');

    const filteredTransactions = useMemo(() => {
        if (filter === 'Semua') return transactions.data;
        return transactions.data.filter((trx) => trx.status === filter);
    }, [filter, transactions.data]);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-2xl">Riwayat Transaksi</CardTitle>
                <CardDescription>
                    Berikut adalah seluruh riwayat donasi Anda (Zakat, Infaq,
                    dan Sedekah).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((status) => (
                            <Button
                                key={status}
                                variant={
                                    filter === status ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setFilter(status)}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((trx) => {
                                const statusInfo = getStatusInfo(trx.status);
                                return (
                                    <Card
                                        key={trx.id}
                                        className="transition-all hover:shadow-md"
                                    >
                                        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            {/* SISI KIRI (INFO UTAMA) */}
                                            <div className="flex flex-1 items-center gap-4">
                                                <div
                                                    className={`hidden rounded-full bg-${statusInfo.variant}/10 p-3 sm:block`}
                                                >
                                                    <statusInfo.icon
                                                        className={`h-6 w-6 text-${statusInfo.variant}`}
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-1 overflow-hidden">
                                                    <p className="truncate font-bold">
                                                        {trx.order_id}
                                                    </p>
                                                    <p className="block text-sm text-muted-foreground">
                                                        {formatDateTime(
                                                            trx.created_at,
                                                        )}
                                                    </p>
                                                    <DonationTypeBadge
                                                        type={trx.type}
                                                    />
                                                </div>
                                            </div>

                                            {/* SISI KANAN (AKSI & NOMINAL) */}
                                            <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
                                                <div className="flex flex-col items-start sm:items-end">
                                                    <p className="text-lg font-bold">
                                                        {formatCurrency(
                                                            trx.final_amount,
                                                        )}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            statusInfo.variant
                                                        }
                                                    >
                                                        {statusInfo.label}
                                                    </Badge>
                                                </div>
                                                <Link
                                                    href={`/transaksi/${trx.order_id}`}
                                                    className="flex-shrink-0"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="rounded-lg border bg-muted/30 py-16 text-center">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">
                                    Tidak ada transaksi dengan status "{filter}
                                    ".
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ## PERUBAHAN 3: Terapkan komponen Pagination shadcn/ui yang baru dan responsif ## */}
                    {filter === 'Semua' && transactions.data.length > 0 && (
                        <div className="w-full overflow-x-auto">
                            <Pagination>
                                <PaginationContent>
                                    {transactions.links.map((link, index) =>
                                        // Menggunakan dangerouslySetInnerHTML karena label dari Laravel bisa berisi HTML
                                        // Ini aman karena kita percaya pada output dari Laravel Paginator
                                        link.label.includes('Previous') ? (
                                            <PaginationPrevious
                                                key={index}
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                            />
                                        ) : link.label.includes('Next') ? (
                                            <PaginationNext
                                                key={index}
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                            />
                                        ) : (
                                            <PaginationLink
                                                key={index}
                                                href={link.url}
                                                isActive={link.active}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ),
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
