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
import { Badge } from '@/components/ui/badge';
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
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Ellipsis,
    FilePen,
    GalleryHorizontal,
    PlusCircle,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Program' },
];

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function Index({ programs, filters, periodes }) {
    const { flash } = usePage().props;
    const [deleteTarget, setDeleteTarget] = useState(null);

    // State untuk semua filter
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [periodeId, setPeriodeId] = useState(filters.periode_id || 'all');
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // useEffect untuk mengirim request saat filter berubah
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
            periode_id: periodeId === 'all' ? undefined : periodeId,
            per_page: filters.per_page,
        };

        const timeout = setTimeout(() => {
            router.get('/admin/programs', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, status, periodeId]);

    const resetFilters = () => {
        setSearch('');
        setStatus('all');
        setPeriodeId('all');
    };

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/programs',
            { ...filters, per_page: perPage },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/programs/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Program" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Program Penyaluran</CardTitle>
                        <Link href="/admin/programs/create">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                                Program
                            </Button>
                        </Link>
                    </div>
                    <CardDescription>
                        Kelola program yang akan ditampilkan di halaman Galeri
                        Program publik.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    {/* ## PANEL FILTER BARU ## */}
                    <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full flex-1 sm:max-w-xs">
                                <Input
                                    type="search"
                                    placeholder="Cari nama program..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <Select
                                value={String(periodeId)}
                                onValueChange={setPeriodeId}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Periode
                                    </SelectItem>
                                    {periodes.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="Published">
                                        Published
                                    </SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            {(filters.search ||
                                filters.status ||
                                filters.periode_id) && (
                                <Button
                                    variant="destructive-outline"
                                    onClick={resetFilters}
                                >
                                    <X className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            )}
                        </div>
                        <div className="w-full sm:w-auto">
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
                    </div>

                    <div className="flex-1 overflow-auto rounded-md border">
                        <Table>
                            <TableHeader className="font-bold uppercase">
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        No.
                                    </TableHead>
                                    <TableHead>Nama Program</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Stats</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-20 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.data.length > 0 ? (
                                    programs.data.map((program, index) => (
                                        <TableRow key={program.id}>
                                            <TableCell className="font-medium">
                                                {programs.from + index}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {program.name}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(
                                                        program.program_date,
                                                    ),
                                                    'dd MMMM yyyy',
                                                    { locale: id },
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <span>
                                                        {program.photos_count}{' '}
                                                        Foto
                                                    </span>
                                                    <span>
                                                        {
                                                            program.penyalurans_count
                                                        }{' '}
                                                        Penyaluran
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            program.penyalurans_sum_amount,
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        program.status ===
                                                        'Published'
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {program.status}
                                                </Badge>
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
                                                                href={`/admin/programs/${program.id}/edit`}
                                                            >
                                                                <FilePen className="mr-2 h-4 w-4" />{' '}
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    program,
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
                                            className="h-full p-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <GalleryHorizontal className="h-16 w-16 text-gray-300" />
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Program
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Data tidak ditemukan. Coba
                                                    ubah filter atau buat
                                                    program baru.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {programs.data.length > 0 && (
                    <CardFooter className="flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <strong>{programs.from || 0}</strong> -{' '}
                            <strong>{programs.to || 0}</strong> dari{' '}
                            <strong>{programs.total || 0}</strong> hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {programs.links.map((link, index) =>
                                    link.label.includes('Previous') ? (
                                        <PaginationPrevious
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                        />
                                    ) : link.label.includes('Next') ? (
                                        <PaginationNext
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                        />
                                    ) : (
                                        <PaginationLink
                                            key={index}
                                            href={link.url}
                                            isActive={link.active}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                )}
            </Card>
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus program{' '}
                            <strong>{deleteTarget?.name}</strong> beserta semua
                            fotonya secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
