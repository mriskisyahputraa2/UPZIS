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
import { PaginatedZakatTypes, ZakatType } from '@/types/zakat-type';
import { Link } from '@inertiajs/react';
import {
    Ellipsis,
    FilePen,
    FileText,
    PlusCircle,
    Trash2,
} from 'lucide-react';

/**
 * @interface ZakatTypesTableProps
 * @description Properti untuk komponen ZakatTypesTable.
 * @property {PaginatedZakatTypes} zakatTypes - Objek data jenis zakat yang dipaginasi.
 * @property {(id: number) => void} onDeleteClick - Handler saat tombol hapus di-klik.
 */
interface ZakatTypesTableProps {
    zakatTypes: PaginatedZakatTypes;
    onDeleteClick: (id: number) => void;
}

/**
 * @name EmptyState
 * @description Komponen yang ditampilkan saat tabel jenis zakat kosong.
 */
const EmptyState = () => (
    <TableRow>
        <TableCell colSpan={6} className="h-full p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-bold">Belum Ada Jenis Zakat</h3>
                <p className="text-muted-foreground">
                    Buat jenis zakat baru untuk memulai.
                </p>
                <Link href="/admin/settings/zakat-types/create">
                    <Button className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Jenis Zakat Pertama
                    </Button>
                </Link>
            </div>
        </TableCell>
    </TableRow>
);

/**
 * @name ZakatTypeTableRow
 * @description Komponen untuk satu baris data pada tabel jenis zakat.
 */
const ZakatTypeTableRow = ({
    item,
    offset,
    onDeleteClick,
}: {
    item: ZakatType;
    offset: number;
    onDeleteClick: (id: number) => void;
}) => (
    <TableRow>
        <TableCell>{offset}</TableCell>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.rate_percent}%</TableCell>
        <TableCell>
            {item.nisab_quantity} {item.nisab_basis}
        </TableCell>
        <TableCell>
            <Badge
                variant={item.status === 'Aktif' ? 'success' : 'secondary'}
            >
                {item.status}
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
                        <Link
                            href={`/admin/settings/zakat-types/${item.id}/edit`}
                        >
                            <FilePen className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDeleteClick(item.id)}
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
 * @name ZakatTypesTable
 * @description Komponen tabel untuk menampilkan daftar jenis zakat.
 * @param {ZakatTypesTableProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const ZakatTypesTable = ({
    zakatTypes,
    onDeleteClick,
}: ZakatTypesTableProps) => {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader className="font-bold uppercase">
                    <TableRow>
                        <TableHead className="w-10">No.</TableHead>
                        <TableHead>Nama Zakat</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Nisab</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {zakatTypes.data.length > 0 ? (
                        zakatTypes.data.map((item, index) => (
                            <ZakatTypeTableRow
                                key={item.id}
                                item={item}
                                offset={zakatTypes.from + index}
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

export default ZakatTypesTable;
