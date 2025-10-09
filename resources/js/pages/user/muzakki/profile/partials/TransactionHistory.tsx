import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link } from '@inertiajs/react';

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
const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'Berhasil':
            return 'success';
        case 'Menunggu Verifikasi':
            return 'warning';
        case 'Menunggu Pembayaran':
            return 'default';
        case 'Gagal':
        case 'Kadaluarsa':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const Pagination = ({ links }) => (
    <div className="mt-4 flex justify-center space-x-1">
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

export default function TransactionHistory({ transactions, className = '' }) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Semua Transaksi Anda</CardTitle>
                <CardDescription>
                    Berikut adalah seluruh riwayat pembayaran zakat Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">
                                    Jumlah
                                </TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.data.length > 0 ? (
                                transactions.data.map((trx) => (
                                    <TableRow key={trx.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/transaksi/${trx.order_id}`}
                                                className="text-primary hover:underline"
                                            >
                                                {trx.order_id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(trx.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(trx.final_amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    trx.status,
                                                )}
                                            >
                                                {trx.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center"
                                    >
                                        Belum ada transaksi.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Pagination links={transactions.links} />
            </CardContent>
        </Card>
    );
}
