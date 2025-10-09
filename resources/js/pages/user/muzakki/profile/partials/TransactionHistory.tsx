import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
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
            return { variant: 'default', icon: Wallet, label: 'Pembayaran' };
        case 'Gagal':
        case 'Kadaluarsa':
            return { variant: 'destructive', icon: XCircle, label: 'Gagal' };
        default:
            return { variant: 'secondary', icon: FileText, label: status };
    }
};

const Pagination = ({ links }) => (
    <div className="mt-6 flex justify-center space-x-1">
        {links.map((link, key) =>
            link.url === null ? (
                <div
                    key={key}
                    className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ) : (
                <Link
                    key={key}
                    href={link.url}
                    preserveScroll
                    className={`rounded-md px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ),
        )}
    </div>
);

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
        // Karena data sudah dipaginasi, filter hanya berlaku untuk data di halaman saat ini
        if (filter === 'Semua') return transactions.data;
        return transactions.data.filter((trx) => trx.status === filter);
    }, [filter, transactions.data]);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-2xl">Riwayat Transaksi</CardTitle>
                <CardDescription>
                    Berikut adalah seluruh riwayat pembayaran zakat Anda.
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
                                        <CardContent className="flex items-center justify-between gap-4 p-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`rounded-full bg-green-50 p-3`}
                                                >
                                                    <statusInfo.icon
                                                        className={`h-6 w-6 text-green-600`}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        {trx.order_id}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            trx.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-right">
                                                <div>
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
                    {filter === 'Semua' && (
                        <Pagination links={transactions.links} />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Dummy CSS classes to make Tailwind recognize them (add to app.css if needed)
// bg-success/10 text-success
// bg-warning/10 text-warning
// bg-default/10 text-default
// bg-destructive/10 text-destructive
// bg-secondary/10 text-secondary
