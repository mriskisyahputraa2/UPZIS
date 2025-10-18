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
import {
    Ellipsis,
    FilePen,
    FileText,
    PlusCircle,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Jenis Zakat' },
];

// Terima props 'zakatTypes' dan 'filters' dari controller
export default function ZakatTypesIndex({ zakatTypes, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState(null);
    const isInitialMount = useRef(true);

    // Efek untuk menampilkan notifikasi toast
    useEffect(() => {
        if (flash && flash.success) toast.success(flash.success);
        if (flash && flash.error) toast.error(flash.error);
    }, [flash]);

    // Efek untuk menangani pencarian dengan debounce
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/settings/zakat-types',
                { search, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // Handler untuk mengubah jumlah data per halaman
    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/settings/zakat-types',
            { search: filters.search, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    // Handler untuk menghapus data
    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/settings/zakat-types/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Jenis Zakat" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Jenis Zakat</CardTitle>
                        <Link href="/admin/settings/zakat-types/create">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Jenis Zakat
                            </Button>
                        </Link>
                    </div>
                    <CardDescription>
                        Kelola jenis zakat yang dapat dipilih saat melakukan
                        transaksi.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="search"
                                placeholder="Cari nama zakat..."
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
                    <div className="flex-1 overflow-auto rounded-md border">
                        <Table>
                            <TableHeader className="font-bold uppercase">
                                <TableRow>
                                    <TableHead className="w-10">No.</TableHead>
                                    <TableHead>Nama Zakat</TableHead>
                                    <TableHead>Rate</TableHead>
                                    <TableHead>Nisab</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-20 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {zakatTypes.data.length > 0 ? (
                                    zakatTypes.data.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {zakatTypes.from + index}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.rate_percent}%
                                            </TableCell>
                                            <TableCell>
                                                {item.nisab_quantity}{' '}
                                                {item.nisab_basis}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status === 'Aktif'
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {item.status}
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
                                                                href={`/admin/settings/zakat-types/${item.id}/edit`}
                                                            >
                                                                <FilePen className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    item.id,
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
                                            colSpan={6}
                                            className="h-full p-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Jenis Zakat
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Buat jenis zakat baru untuk
                                                    memulai.
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
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {zakatTypes.data.length > 0 && (
                    <CardFooter className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-semibold">
                                {zakatTypes.from || 0}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold">
                                {zakatTypes.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold">
                                {zakatTypes.total || 0}
                            </span>{' '}
                            hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {zakatTypes.links.map((link, index) =>
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
                            Tindakan ini akan menghapus data jenis zakat secara
                            permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
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
