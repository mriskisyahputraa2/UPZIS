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
import { Ellipsis, Eye, Inbox, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pesan Masuk' },
];

export default function Index({ contacts, filters }) {
    const { flash } = usePage().props;
    const [deleteTarget, setDeleteTarget] = useState(null);

    // State untuk filter
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
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
            per_page: filters.per_page,
        };
        const timeout = setTimeout(() => {
            router.get('/admin/kontak', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, status]);

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/kontak',
            { ...filters, per_page: perPage },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('all');
    };

    const handleDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/kontak/${deleteTarget.id}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesan Masuk" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Kotak Masuk</CardTitle>
                    <CardDescription>
                        Kelola semua pesan yang masuk dari halaman kontak
                        publik.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    {/* ## PANEL FILTER BARU ## */}
                    <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full flex-1 sm:max-w-xs">
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="Baru">Baru</SelectItem>
                                    <SelectItem value="Sudah Dibaca">
                                        Sudah Dibaca
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {(filters.search || filters.status) && (
                                <Button variant="ghost" onClick={resetFilters}>
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
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        No.
                                    </TableHead>
                                    <TableHead>Pengirim</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal Diterima</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
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
                                                        contact.status ===
                                                        'Baru'
                                                            ? 'info'
                                                            : 'success'
                                                    }
                                                >
                                                    {contact.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(
                                                        contact.created_at,
                                                    ),
                                                    'dd MMM yyyy, HH:mm',
                                                    { locale: id },
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/kontak/${contact.id}`}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />{' '}
                                                                Lihat Pesan
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-500"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    contact,
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
                                            colSpan={5}
                                            className="h-full p-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Inbox className="h-16 w-16 text-gray-300" />
                                                <h3 className="text-xl font-bold">
                                                    Kotak Masuk Kosong
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Tidak ada pesan yang cocok
                                                    dengan filter atau belum ada
                                                    pesan baru.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {contacts.data.length > 0 && (
                    <CardFooter className="flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <strong>{contacts.from || 0}</strong> -{' '}
                            <strong>{contacts.to || 0}</strong> dari{' '}
                            <strong>{contacts.total || 0}</strong> hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {contacts.links.map((link, index) =>
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
            <AlertDialog open={!!deleteTarget} onOpenChange={setDeleteTarget}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda yakin ingin menghapus pesan dari{' '}
                            <strong>{deleteTarget?.name}</strong>? Tindakan ini
                            tidak dapat dibatalkan.
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
