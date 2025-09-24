// resources/js/Pages/Admin/Mustahiks/Index.jsx

// import { PaginationComponent } from '@/components/pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Ellipsis, FilePen, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
];

export default function Index({ mustahiks, flash, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Jangan jalankan efek pada saat komponen pertama kali dimuat
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/mustahiks',
                { search: search, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    // Fungsi untuk mengubah jumlah data per halaman
    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/mustahiks',
            { search: filters.search, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    // Fungsi untuk menghapus data
    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/mustahiks/${deleteId}`, {
                onSuccess: () =>
                    toast.success('Data mustahik berhasil dihapus!'),
                onError: () => toast.error('Gagal menghapus data.'),
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Mustahik" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Mustahik</h1>
                    <Link href="/admin/mustahiks/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Mustahik
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="search"
                                placeholder="Cari nama atau NIK..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <Select
                            onValueChange={handlePerPageChange}
                            defaultValue={filters.per_page || '5'}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 Data</SelectItem>
                                <SelectItem value="10">10 Data</SelectItem>
                                <SelectItem value="20">20 Data</SelectItem>
                                <SelectItem value="50">50 Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <Table>
                        <TableHeader className="bg-gray-50 uppercase dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="w-[50px] font-bold">
                                    No.
                                </TableHead>
                                <TableHead className="font-bold">
                                    Foto
                                </TableHead>
                                <TableHead className="font-bold">
                                    Nama Lengkap
                                </TableHead>
                                <TableHead className="font-bold">
                                    Nomor Induk Kependudukan
                                </TableHead>
                                <TableHead className="font-bold">
                                    No. Telepon
                                </TableHead>
                                <TableHead className="w-[100px] text-right font-bold">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mustahiks.data.length > 0 ? (
                                mustahiks.data.map((mustahik, index) => (
                                    <TableRow
                                        key={mustahik.id}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                                    >
                                        <TableCell>
                                            {mustahiks.from + index}
                                        </TableCell>
                                        <TableCell>
                                            {mustahik.photo ? (
                                                <img
                                                    src={`/storage/${mustahik.photo}`}
                                                    alt={mustahik.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
                                                    No Img
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {mustahik.name}
                                        </TableCell>
                                        <TableCell>{mustahik.nik}</TableCell>
                                        <TableCell>
                                            {mustahik.phone_number || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Ellipsis className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/mustahiks/${mustahik.id}/edit`}
                                                        >
                                                            <FilePen className="mr-2 h-4 w-4" />{' '}
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                        onClick={() =>
                                                            setDeleteId(
                                                                mustahik.id,
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
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={mustahiks.links} />
            </div>

            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data mustahik secara
                            permanen dan tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
