import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    CardDescription,
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
    AlertTriangle,
    Ellipsis,
    Eye,
    FilePen,
    Info,
    PlusCircle,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik' },
];

const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function Index({ mustahiks, filters, periodes, activePeriode }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [filterPeriode, setFilterPeriode] = useState(
        filters.periode_id || 'all',
    );
    const [deleteId, setDeleteId] = useState(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (flash && flash.success) toast.success(flash.success);
        if (flash && flash.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const params = {
            search,
            per_page: filters.per_page,
            periode_id: filterPeriode === 'all' ? '' : filterPeriode,
        };
        const timeout = setTimeout(() => {
            router.get('/admin/mustahiks', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, filterPeriode]);

    const handlePerPageChange = (perPage) => {
        const params = {
            search: filters.search,
            per_page: perPage,
            periode_id: filters.periode_id,
        };
        router.get('/admin/mustahiks', params, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setFilterPeriode('all');
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/mustahiks/${deleteId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Mustahik" />

            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            Daftar Penerima Manfaat (Mustahik)
                        </CardTitle>
                        {/* {activePeriode ? (
                            // Jika ada periode aktif, tombol bisa diklik
                            <Link href="/admin/mustahiks/create">
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Mustahik
                                </Button>
                            </Link>
                        ) : ( */}
                        {/* // Jika tidak ada periode aktif, tombol nonaktif dengan tooltip */}
                        {/* <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span tabIndex="0">
                                        <Button disabled>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Tambah Mustahik
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Aktifkan satu periode terlebih dahulu
                                        untuk menambah data.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider> */}
                        {/* )} */}
                    </div>
                    <CardDescription>
                        Kelola data induk semua calon penerima manfaat di sini.
                    </CardDescription>

                    <div className="!mt-4">
                        {activePeriode ? (
                            <Alert variant="info">
                                <Info className="h-4 w-4" />
                                <AlertTitle>
                                    Periode Pendaftaran Aktif
                                </AlertTitle>
                                <AlertDescription>
                                    Saat ini periode pendaftaran yang sedang
                                    aktif adalah{' '}
                                    <strong className="text-green-600">
                                        {activePeriode.name}
                                    </strong>
                                    .
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="warning">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Tidak Ada Periode Aktif</AlertTitle>
                                <AlertDescription>
                                    Formulir pendaftaran publik saat ini sedang
                                    ditutup.
                                    <Button
                                        variant="link"
                                        asChild
                                        className="ml-1 h-auto p-0"
                                    >
                                        <Link href="/admin/periode">
                                            Aktifkan periode.
                                        </Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-auto sm:max-w-xs">
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
                                value={String(filterPeriode)}
                                onValueChange={setFilterPeriode}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Periode
                                    </SelectItem>
                                    {periodes.map((periode) => (
                                        <SelectItem
                                            key={periode.id}
                                            value={String(periode.id)}
                                        >
                                            {periode.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(filters.search || filters.periode_id) && (
                                <Button
                                    variant="destructive-outline"
                                    onClick={resetFilters}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            )}
                        </div>
                        <Select
                            onValueChange={handlePerPageChange}
                            defaultValue={String(filters.per_page || '5')}
                        >
                            <SelectTrigger className="w-full sm:w-[120px]">
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
                    <div className="flex-1 overflow-auto rounded-md border">
                        <Table>
                            <TableHeader className="font-bold uppercase">
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
                                                                Lihat Detail
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
                                            className="h-24 p-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Users className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Data Mustahik
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Data tidak ditemukan. Coba
                                                    ubah filter atau tambahkan
                                                    data baru.
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
                </CardContent>
                {mustahiks.data.length > 0 && (
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
                                {mustahiks.links.map((link, index) =>
                                    link.label.includes('Previous') ? (
                                        <PaginationPrevious
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                        />
                                    ) : link.label.includes('Next') ? (
                                        <PaginationNext
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                        />
                                    ) : (
                                        <PaginationLink
                                            key={index}
                                            href={link.url}
                                            isActive={link.active}
                                            preserveScroll
                                            preserveState
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    ),
                                )}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                )}
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
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
