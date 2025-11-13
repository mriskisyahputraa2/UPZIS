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
import { Admin, PaginatedAdmins } from '@/types/admin';
import { Link } from '@inertiajs/react';
import { Ellipsis, FilePen, PlusCircle, Trash2, Users } from 'lucide-react';

/**
 * @interface AdminsTableProps
 * @description Properti untuk komponen AdminsTable.
 * @property {PaginatedAdmins} admins - Objek data admin yang dipaginasi.
 * @property {(id: number) => void} onDeleteClick - Handler saat tombol hapus di-klik.
 */
interface AdminsTableProps {
    admins: PaginatedAdmins;
    onDeleteClick: (id: number) => void;
}

/**
 * @name EmptyState
 * @description Komponen yang ditampilkan saat tabel admin kosong.
 */
const EmptyState = () => (
    <TableRow>
        <TableCell colSpan={4} className="h-full p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <Users className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-bold">Belum Ada Admin</h3>
                <p className="text-muted-foreground">
                    Tambahkan admin baru untuk membantu mengelola sistem.
                </p>
                <Link href="/admin/settings/admins/create">
                    <Button className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Admin Pertama
                    </Button>
                </Link>
            </div>
        </TableCell>
    </TableRow>
);

/**
 * @name AdminTableRow
 * @description Komponen untuk satu baris data pada tabel admin.
 */
const AdminTableRow = ({
    admin,
    offset,
    onDeleteClick,
}: {
    admin: Admin;
    offset: number;
    onDeleteClick: (id: number) => void;
}) => (
    <TableRow>
        <TableCell>{offset}</TableCell>
        <TableCell className="font-medium">{admin.name}</TableCell>
        <TableCell>{admin.email}</TableCell>
        <TableCell className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <Ellipsis className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/settings/admins/${admin.id}/edit`}>
                            <FilePen className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDeleteClick(admin.id)}
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
 * @name AdminsTable
 * @description Komponen tabel untuk menampilkan daftar admin.
 * @param {AdminsTableProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const AdminsTable = ({ admins, onDeleteClick }: AdminsTableProps) => {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader className="font-bold uppercase">
                    <TableRow>
                        <TableHead className="w-10">No.</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admins.data.length > 0 ? (
                        admins.data.map((admin, index) => (
                            <AdminTableRow
                                key={admin.id}
                                admin={admin}
                                offset={admins.from + index}
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

export default AdminsTable;
