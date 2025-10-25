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
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Banknote, BookUser, Inbox } from 'lucide-react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

const TaskCard = ({ title, value, description, icon: Icon, href }) => (
    <Link href={href}>
        <Card className="transition-all hover:bg-muted/50 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </Link>
);

export default function TugasDanAktivitas({ realtimeStats }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col gap-4 xl:col-span-1">
                <TaskCard
                    title="Verifikasi Transaksi"
                    value={realtimeStats.transaksiBaru}
                    description={`Total ${formatCurrency(realtimeStats.danaMenungguVerifikasi)}`}
                    icon={Banknote}
                    href="/admin/transaksi?status=Menunggu Verifikasi"
                />
                <TaskCard
                    title="Permohonan Bantuan Baru"
                    value={realtimeStats.permohonanBaru}
                    description="Perlu segera ditinjau"
                    icon={BookUser}
                    href="/admin/permohonan?status=Baru"
                />
                <TaskCard
                    title="Pesan Masuk Baru"
                    value={realtimeStats.pesanBaru}
                    description="Pesan dari pengunjung website"
                    icon={Inbox}
                    href="/admin/kontak?status=Baru"
                />
            </div>
            <Card className="shadow-md xl:col-span-2">
                <CardHeader>
                    <CardTitle>Aktivitas Transaksi Terbaru</CardTitle>
                    <CardDescription>
                        5 aktivitas transaksi terakhir di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Jumlah
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {realtimeStats.recentMuzakkis.length > 0 ? (
                                realtimeStats.recentMuzakkis.map((trx) => (
                                    <TableRow key={trx.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {trx.user?.name || 'Anonim'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    trx.status ===
                                                        'Menunggu Pembayaran' &&
                                                        'border-blue-200 bg-blue-100 text-blue-800',
                                                    trx.status === 'Berhasil' &&
                                                        'border-emerald-200 bg-emerald-100 text-emerald-800',
                                                    trx.status ===
                                                        'Menunggu Verifikasi' &&
                                                        'border-amber-200 bg-amber-100 text-amber-800',
                                                    trx.status === 'Gagal' &&
                                                        'border-rose-200 bg-rose-100 text-rose-800',
                                                )}
                                            >
                                                {trx.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(trx.final_amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center"
                                    >
                                        Belum ada transaksi.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
