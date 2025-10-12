import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Ellipsis, Eye, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const getStatusTriggerClass = (status) => {
    switch (status) {
        case 'Baru':
            return 'border-blue-500 bg-blue-50 text-blue-800';
        case 'Diverifikasi':
            return 'border-yellow-500 bg-yellow-50 text-yellow-800';
        case 'Disetujui':
            return 'border-green-500 bg-green-50 text-green-800';
        case 'Ditolak':
            return 'border-red-500 bg-red-50 text-red-800';
        default:
            return '';
    }
};

export default function PermohonanTable({
    permohonans,
    selectedRows,
    onRowSelect,
    onSelectAll,
    onSetDeleteTarget,
}) {
    const handleInlineStatusChange = (id, newStatus) => {
        router.patch(
            `/admin/permohonan/${id}`,
            { status: newStatus },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Status berhasil diperbarui.'),
                onError: () => toast.error('Gagal memperbarui status.'),
            },
        );
    };

    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader className="uppercase">
                    <TableRow>
                        <TableHead className="w-12 px-4">
                            <Checkbox
                                checked={
                                    permohonans.data.length > 0 &&
                                    selectedRows.length ===
                                        permohonans.data.length
                                }
                                onCheckedChange={onSelectAll}
                                aria-label="Pilih semua"
                            />
                        </TableHead>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead className="min-w-[150px]">
                            Nama Pemohon
                        </TableHead>
                        <TableHead className="min-w-[150px]">Periode</TableHead>
                        <TableHead className="min-w-[120px]">
                            Tgl. Pengajuan
                        </TableHead>
                        <TableHead className="w-48">Status</TableHead>
                        <TableHead className="w-[100px] text-right">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permohonans.data.length > 0 ? (
                        permohonans.data.map((permohonan, index) => (
                            <TableRow
                                key={permohonan.id}
                                data-state={
                                    selectedRows.includes(permohonan.id) &&
                                    'selected'
                                }
                            >
                                <TableCell className="px-4">
                                    <Checkbox
                                        checked={selectedRows.includes(
                                            permohonan.id,
                                        )}
                                        onCheckedChange={() =>
                                            onRowSelect(permohonan.id)
                                        }
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {permohonans.from + index}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {permohonan.mustahik.name}
                                </TableCell>
                                <TableCell>{permohonan.periode.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>
                                            {format(
                                                new Date(permohonan.created_at),
                                                'dd MMMM yyyy',
                                                { locale: id },
                                            )}
                                        </span>
                                        <span className="text-xs text-green-600">
                                            {format(
                                                new Date(permohonan.created_at),
                                                'HH:mm',
                                                { locale: id },
                                            )}{' '}
                                            WIB
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={permohonan.status}
                                        onValueChange={(newStatus) =>
                                            handleInlineStatusChange(
                                                permohonan.id,
                                                newStatus,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={getStatusTriggerClass(
                                                permohonan.status,
                                            )}
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Baru">
                                                Baru
                                            </SelectItem>
                                            <SelectItem value="Diverifikasi">
                                                Diverifikasi
                                            </SelectItem>
                                            <SelectItem value="Disetujui">
                                                Disetujui
                                            </SelectItem>
                                            <SelectItem value="Ditolak">
                                                Ditolak
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
                                                    href={`/admin/permohonan/${permohonan.id}`}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />{' '}
                                                    Lihat Detail
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                                onClick={() =>
                                                    onSetDeleteTarget(
                                                        permohonan,
                                                    )
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                    <h3 className="text-xl font-bold">
                                        Belum Ada Permohonan
                                    </h3>
                                    <p className="text-gray-500">
                                        Data tidak ditemukan. Coba ubah filter
                                        atau tunggu permohonan baru masuk.
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
