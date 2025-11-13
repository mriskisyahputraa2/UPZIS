import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginatedPeriodes, Periode } from '@/types/periode';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    CalendarDays,
    Ellipsis,
    FilePen,
    PlusCircle,
    Trash2,
} from 'lucide-react';

/**
 * @interface PeriodeTableProps
 * @description Properti untuk komponen PeriodeTable.
 * @property {PaginatedPeriodes} periodes - Objek data periode yang dipaginasi.
 * @property {(id: number) => void} onDeleteClick - Handler saat tombol hapus di-klik.
 */
interface PeriodeTableProps {
    periodes: PaginatedPeriodes;
    onDeleteClick: (id: number) => void;
}

/**
 * @name EmptyState
 * @description Komponen yang ditampilkan saat tidak ada data periode.
 * @returns {JSX.Element}
 */
const EmptyState = () => (
    <TableRow>
        <TableCell colSpan={6} className="h-full p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <CalendarDays className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-bold">Belum Ada Periode</h3>
                <p className="text-muted-foreground">
                    Buat periode pendaftaran baru untuk memulai siklus bantuan.
                </p>
                <Link href="/admin/periode/create">
                    <Button className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Periode Pertama
                    </Button>
                </Link>
            </div>
        </TableCell>
    </TableRow>
);

/**
 * @name PeriodeTableRow
 * @description Komponen untuk satu baris data pada tabel periode.
 * @param {object} props - Properti komponen.
 * @param {Periode} props.periode - Data periode untuk baris ini.
 * @param {number} props.offset - Nomor urutan awal.
 * @param {(id: number) => void} props.onDeleteClick - Handler untuk tombol hapus.
 * @returns {JSX.Element}
 */
const PeriodeTableRow = ({
    periode,
    offset,
    onDeleteClick,
}: {
    periode: Periode;
    offset: number;
    onDeleteClick: (id: number) => void;
}) => (
    <TableRow>
        <TableCell>{offset}</TableCell>
        <TableCell className="font-medium">{periode.name}</TableCell>
        <TableCell>
            {format(new Date(periode.start_date), 'dd MMMM yyyy', {
                locale: id,
            })}
        </TableCell>
        <TableCell>
            {format(new Date(periode.end_date), 'dd MMMM yyyy', { locale: id })}
        </TableCell>
        <TableCell>
            <Badge
                variant={periode.status === 'Aktif' ? 'success' : 'secondary'}
            >
                {periode.status}
            </Badge>
        </TableCell>
        <TableCell className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <Ellipsis className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/periode/${periode.id}/edit`}>
                            <FilePen className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDeleteClick(periode.id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    </TableRow>
);

/**
 * @name PeriodeTable
 * @description Komponen tabel utama untuk menampilkan daftar periode.
 * @param {PeriodeTableProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const PeriodeTable = ({ periodes, onDeleteClick }: PeriodeTableProps) => {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader className="font-bold uppercase">
                    <TableRow>
                        <TableHead className="w-10">No.</TableHead>
                        <TableHead>Nama Periode</TableHead>
                        <TableHead>Tanggal Mulai</TableHead>
                        <TableHead>Tanggal Selesai</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {periodes.data.length > 0 ? (
                        periodes.data.map((periode, index) => (
                            <PeriodeTableRow
                                key={periode.id}
                                periode={periode}
                                offset={periodes.from + index}
                                onDeleteClick={onDeleteClick}
                            />
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default PeriodeTable;
