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
import { PaginatedPrograms, ProgramListItem } from '@/types/program';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Ellipsis, FilePen, GalleryHorizontal, Trash2 } from 'lucide-react';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

/**
 * @interface ProgramTableProps
 * @description Properti untuk komponen ProgramTable.
 */
interface ProgramTableProps {
    programs: PaginatedPrograms;
    onDeleteClick: (program: ProgramListItem) => void;
}

/**
 * @name EmptyState
 * @description Komponen yang ditampilkan saat tabel program kosong.
 */
const EmptyState = () => (
    <TableRow>
        <TableCell colSpan={6} className="h-full p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <GalleryHorizontal className="h-16 w-16 text-gray-300" />
                <h3 className="text-xl font-bold">Belum Ada Program</h3>
                <p className="text-muted-foreground">
                    Data tidak ditemukan. Coba ubah filter atau buat program
                    baru.
                </p>
            </div>
        </TableCell>
    </TableRow>
);

/**
 * @name ProgramTableRow
 * @description Komponen untuk satu baris data pada tabel program.
 */
const ProgramTableRow = ({
    program,
    offset,
    onDeleteClick,
}: {
    program: ProgramListItem;
    offset: number;
    onDeleteClick: (program: ProgramListItem) => void;
}) => (
    <TableRow>
        <TableCell className="font-medium">{offset}</TableCell>
        <TableCell className="font-medium">{program.name}</TableCell>
        <TableCell>
            {format(new Date(program.program_date), 'dd MMMM yyyy', {
                locale: id,
            })}
        </TableCell>
        <TableCell>
            <div className="flex flex-col text-xs">
                <span>{program.photos_count} Foto</span>
                <span>{program.penyalurans_count} Penyaluran</span>
                <span className="font-semibold">
                    {formatCurrency(program.penyalurans_sum_amount)}
                </span>
            </div>
        </TableCell>
        <TableCell>
            <Badge
                variant={program.status === 'Published' ? 'success' : 'secondary'}
            >
                {program.status}
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
                        <Link href={`/admin/programs/${program.id}/edit`}>
                            <FilePen className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDeleteClick(program)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    </TableRow>
);

/**
 * @name ProgramTable
 * @description Komponen tabel untuk menampilkan daftar program.
 * @returns {JSX.Element}
 */
const ProgramTable = ({ programs, onDeleteClick }: ProgramTableProps) => {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader className="font-bold uppercase">
                    <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Nama Program</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programs.data.length > 0 ? (
                        programs.data.map((program, index) => (
                            <ProgramTableRow
                                key={program.id}
                                program={program}
                                offset={programs.from + index}
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

export default ProgramTable;
