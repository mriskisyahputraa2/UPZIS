// resources/js/Pages/Admin/Mustahiks/Index.jsx (Perbaikan Final)

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
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Ellipsis,
    Eye,
    FilePen,
    PlusCircle,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react'; // ## 1. TAMBAHKAN `useRef`
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
];

const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function Index({ mustahiks, filters }) {
    const { flash } = usePage().props;
    console.log('Flash props:', flash);

    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // ## 2. BUAT "PENANDA" UNTUK RENDER PERTAMA KALI ##
    const isInitialMount = useRef(true);

    // useEffect untuk Toast (Sudah Benar)
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // ## 3. TULIS ULANG useEffect UNTUK PENCARIAN ##
    useEffect(() => {
        // Jika ini adalah render pertama, jangan lakukan apa-apa.
        // Cukup ubah penanda menjadi false dan keluar dari fungsi.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Kode di bawah ini HANYA akan berjalan setelah render pertama
        // (yaitu, ketika pengguna benar-benar mengetik di input search)
        const timeout = setTimeout(() => {
            setIsLoading(true);
            router.get(
                '/admin/mustahiks',
                { search, per_page: filters.per_page },
                {
                    preserveState: true,
                    replace: true,
                    onFinish: () => setIsLoading(false),
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]); // <-- Dependensi sekarang HANYA `search`

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

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/mustahiks/${deleteId}`, {
                onError: () => toast.error('Gagal menghapus data.'),
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Mustahik" />

            <Card>
                {/* ... Sisa kode JSX di sini tidak ada yang berubah sama sekali ... */}
                <CardHeader>
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Daftar Mustahik</CardTitle>
                        <Link href="/admin/mustahiks/create">
                            <Button>
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
                            defaultValue={String(filters.per_page || '5')}
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
                    <div className="overflow-hidden rounded-md border uppercase">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        No.
                                    </TableHead>
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead>
                                        Nomor Induk Kependudukan
                                    </TableHead>
                                    <TableHead>No. Telepon</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({
                                        length: filters.per_page || 5,
                                    }).map((_, i) => (
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
                                                                href={`/admin/mustahiks/${mustahik.id}`}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Detail
                                                            </Link>
                                                        </DropdownMenuItem>
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
                            {mustahiks.links.map((link, index) => {
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
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
