/**
 * @file ContactsTable.tsx
 * @description Komponen tabel untuk menampilkan daftar pesan kontak.
 * Menangani tampilan baris data dan juga tampilan saat tidak ada data (kosong).
 *
 * @component ContactsTable
 * @param {object} props - Properti komponen.
 * @param {object} props.contacts - Objek paginasi data kontak dari Inertia.
 * @param {(contact: object) => void} props.onDelete - Fungsi yang dipanggil saat tombol hapus diklik.
 * @returns {JSX.Element} Komponen tabel kontak.
 */
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
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Ellipsis, Eye, Inbox, Trash2 } from 'lucide-react';
import React from 'react';

interface Contact {
    id: number;
    name: string;
    email: string;
    status: 'Baru' | 'Sudah Dibaca';
    created_at: string;
}

interface ContactsTableProps {
    contacts: {
        data: Contact[];
        from: number;
    };
    onDelete: (contact: Contact) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
    contacts,
    onDelete,
}) => {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Pengirim</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal Diterima</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts.data.length > 0 ? (
                        contacts.data.map((contact, index) => (
                            <TableRow key={contact.id}>
                                <TableCell className="font-medium">
                                    {contacts.from + index}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        {contact.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {contact.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            contact.status === 'Baru'
                                                ? 'info'
                                                : 'success'
                                        }
                                    >
                                        {contact.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(contact.created_at),
                                        'dd MMM yyyy, HH:mm',
                                        { locale: id },
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Ellipsis className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/admin/kontak/${contact.id}`}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />{' '}
                                                    Lihat Pesan
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-500"
                                                onClick={() => onDelete(contact)}
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
                            <TableCell
                                colSpan={5}
                                className="h-full p-8 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <Inbox className="h-16 w-16 text-gray-300" />
                                    <h3 className="text-xl font-bold">
                                        Kotak Masuk Kosong
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Tidak ada pesan yang cocok dengan
                                        filter atau belum ada pesan baru.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ContactsTable;
