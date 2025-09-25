// resources/js/Pages/Admin/Mustahiks/Index.jsx

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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

// Helper function untuk mendapatkan inisial nama
const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function Index({ mustahiks, filters }) {
    // State lokal untuk input, diinisialisasi dari props
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Tandai render pertama kali untuk mencegah useEffect berjalan
    const isInitialMount = useRef(true);

    // EFEK #1: Memicu pencarian saat pengguna mengetik (dengan debounce)
    useEffect(() => {
        // Jangan jalankan apa pun saat komponen pertama kali dimuat
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Mulai loading spinner saat pengguna mulai mengetik
        setIsLoading(true);

        // Atur timer untuk debounce
        const handler = setTimeout(() => {
            router.get(
                '/admin/mustahiks',
                { search: search, per_page: filters.per_page },
                {
                    preserveState: true,
                    replace: true, // replace agar tidak menumpuk history browser
                    onFinish: () => setIsLoading(false),
                },
            );
        }, 500); // Jeda 500ms sebelum request

        // Fungsi cleanup: batalkan timer jika user mengetik lagi
        return () => {
            clearTimeout(handler);
        };
    }, [search]); // Dependency hanya 'search'

    // EFEK #2: Sinkronisasi state lokal jika props dari server berubah
    // Ini penting untuk tombol back/forward browser
    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    // Fungsi untuk mengubah jumlah data per halaman
    const handlePerPageChange = (perPage) => {
        setIsLoading(true);
        router.get(
            '/admin/mustahiks',
            { search: filters.search, per_page: perPage },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
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

            <Card className="h-full">
                <CardHeader>
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Daftar Mustahik</CardTitle>
                        <Link href="/admin/mustahiks/create">
                            <Button className="text-white">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Mustahik
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-2 pb-4">
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
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        No.
                                    </TableHead>
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead>NIK</TableHead>
                                    <TableHead>No. Telepon</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Skeleton Loading
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-5 w-5 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <Skeleton className="h-5 w-32 rounded" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-5 w-40 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-5 w-28 rounded" />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Skeleton className="ml-auto h-8 w-8 rounded" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : mustahiks.data.length > 0 ? (
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
                                                            {getInitials(
                                                                mustahik.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">
                                                        {mustahik.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {mustahik.nik}
                                            </TableCell>
                                            <TableCell>
                                                {mustahik.phone_number || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
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
                                                                setDeleteId(
                                                                    mustahik.id,
                                                                )
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
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan{' '}
                        <span className="font-semibold">
                            {mustahiks.from || 0}
                        </span>{' '}
                        -{' '}
                        <span className="font-semibold">
                            {mustahiks.to || 0}
                        </span>{' '}
                        dari{' '}
                        <span className="font-semibold">
                            {mustahiks.total || 0}
                        </span>{' '}
                        hasil
                    </div>
                    <Pagination>
                        <PaginationContent>
                            {/* ======================================================= */}
                            {/* LOGIKA PAGINATION BARU UNTUK TAMPILAN KONSISTEN         */}
                            {/* ======================================================= */}
                            {mustahiks.links.map((link, index) => {
                                // Render tombol "Previous"
                                if (link.label.includes('Previous')) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationPrevious
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                            />
                                        </PaginationItem>
                                    );
                                }
                                // Render tombol "Next"
                                if (link.label.includes('Next')) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationNext
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                            />
                                        </PaginationItem>
                                    );
                                }
                                // Render tombol angka
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url}
                                            isActive={link.active}
                                            preserveScroll
                                            preserveState
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>

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
