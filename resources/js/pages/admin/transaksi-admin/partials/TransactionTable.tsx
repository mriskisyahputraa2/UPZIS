import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Ellipsis, Eye, FileText, Loader } from 'lucide-react'; // Import Loader

const formatDateOnly = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
const getStatusTriggerClass = (status) => {
    switch (status) {
        case 'Menunggu Pembayaran':
            return 'border-gray-500 bg-gray-50 text-gray-800';
        case 'Menunggu Verifikasi':
            return 'border-yellow-500 bg-yellow-50 text-yellow-800';
        case 'Berhasil':
            return 'border-green-500 bg-green-50 text-green-800';
        case 'Gagal':
        case 'Kadaluarsa':
            return 'border-red-500 bg-red-50 text-red-800';
        default:
            return '';
    }
};

export default function TransactionTable({
    transaksis,
    handleInlineStatusChange,
    isLoading,
}) {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Nama Muzakki</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                <Loader className="mx-auto h-8 w-8 animate-spin text-primary" />
                            </TableCell>
                        </TableRow>
                    ) : transaksis.data.length > 0 ? (
                        transaksis.data.map((trx, index) => (
                            <TableRow key={trx.id}>
                                <TableCell className="font-medium">
                                    {transaksis.from + index}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {trx.order_id}
                                </TableCell>
                                <TableCell>{trx.user.name}</TableCell>
                                <TableCell>{trx.payment_method}</TableCell>
                                <TableCell>
                                    {formatCurrency(trx.final_amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>
                                            {formatDateOnly(trx.created_at)}
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            {formatTimeOnly(trx.created_at)} WIB
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={trx.status}
                                        onValueChange={(newStatus) =>
                                            handleInlineStatusChange(
                                                trx.id,
                                                newStatus,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={getStatusTriggerClass(
                                                trx.status,
                                            )}
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Menunggu Pembayaran">
                                                Menunggu Pembayaran
                                            </SelectItem>
                                            <SelectItem value="Menunggu Verifikasi">
                                                Menunggu Verifikasi
                                            </SelectItem>
                                            <SelectItem value="Berhasil">
                                                Berhasil
                                            </SelectItem>
                                            <SelectItem value="Gagal">
                                                Gagal
                                            </SelectItem>
                                            <SelectItem value="Kadaluarsa">
                                                Kadaluarsa
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <Ellipsis className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/admin/transaksi/${trx.id}`}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />{' '}
                                                    Lihat Detail
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <FileText className="h-16 w-16 text-gray-300" />
                                    <h3 className="text-xl font-bold">
                                        Belum Ada Transaksi
                                    </h3>
                                    <p className="text-gray-500">
                                        Data tidak ditemukan. Coba ubah filter.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
