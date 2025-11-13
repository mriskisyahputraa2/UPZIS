import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Mustahik } from '@/types';
import { Link } from '@inertiajs/react';
import { Ellipsis, Eye, FilePen, PlusCircle, Trash2, Users } from 'lucide-react';
import React from 'react';

const getInitials = (name?: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

const KategoriBadge = ({ kategori }: { kategori?: string }) => {
    if (!kategori) {
        return <Badge variant="secondary">N/A</Badge>;
    }
    const isMahasiswa = kategori === 'mahasiswa';
    return (
        <Badge variant={isMahasiswa ? 'default' : 'warning'}>
            {isMahasiswa ? 'Mahasiswa' : 'Fakir/Miskin'}
        </Badge>
    );
};

/**
 * @summary Properti untuk komponen MustahikTable.
 */
interface MustahikTableProps {
    mustahiks: {
        data: Mustahik[];
        from: number;
    };
    setDeleteId: (id: number | null) => void;
}

/**
 * @summary Komponen untuk menampilkan tabel data mustahik.
 * @description Menampilkan data mustahik dalam sebuah tabel, lengkap dengan avatar,
 *              badge kategori, dan menu aksi untuk setiap baris. Juga menangani
 *              tampilan saat tidak ada data yang ditemukan.
 * @param {MustahikTableProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen tabel data mustahik.
 */
export default function MustahikTable({
    mustahiks,
    setDeleteId,
}: MustahikTableProps): JSX.Element {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader className="font-bold uppercase">
                    <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Nama Lengkap</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>No. Telepon</TableHead>
                        <TableHead className="w-[100px] text-right">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mustahiks.data.length > 0 ? (
                        mustahiks.data.map((mustahik, index) => (
                            <TableRow key={mustahik.id}>
                                <TableCell className="font-medium">
                                    {mustahiks.from + index}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    mustahik.photo
                                                        ? `/storage/${mustahik.photo}`
                                                        : ''
                                                }
                                                alt={mustahik.name}
                                            />
                                            <AvatarFallback>
                                                {getInitials(mustahik.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {mustahik.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <KategoriBadge
                                        kategori={
                                            mustahik.latest_permohonan
                                                ?.kategori_pemohon
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    {mustahik.jenis_kelamin || '-'}
                                </TableCell>
                                <TableCell>
                                    {mustahik.phone_number || '-'}
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
                                                    href={`/admin/mustahiks/${mustahik.id}`}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Lihat Detail
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/admin/mustahiks/${mustahik.id}/edit`}
                                                >
                                                    <FilePen className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() =>
                                                    setDeleteId(mustahik.id)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="h-24 p-8 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <Users className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                    <h3 className="text-xl font-bold">
                                        Belum Ada Data Mustahik
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Data tidak ditemukan. Coba ubah filter
                                        atau tambahkan data baru.
                                    </p>
                                    <Link href="/admin/mustahiks/create">
                                        <Button className="mt-2">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Tambah Mustahik
                                        </Button>
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
