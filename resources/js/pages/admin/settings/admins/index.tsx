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
    PlusCircle,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Manajemen Admin' },
];

export default function AdminsIndex({ admins, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
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
        const timeout = setTimeout(() => {
            router.get(
                '/admin/settings/admins',
                { search, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/settings/admins',
            { search: filters.search, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/settings/admins/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Admin" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Admin</CardTitle>
                        <Link href="/admin/settings/admins/create">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Admin
                            </Button>
                        </Link>
                    </div>
                    <CardDescription>
                        Kelola akun yang memiliki akses ke panel admin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="search"
                                placeholder="Cari nama atau email..."
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
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-20 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.data.length > 0 ? (
                                    admins.data.map((admin, index) => (
                                        <TableRow key={admin.id}>
                                            <TableCell>
                                                {admins.from + index}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {admin.name}
                                            </TableCell>
                                            <TableCell>{admin.email}</TableCell>
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
                                                                href={`/admin/settings/admins/${admin.id}/edit`}
                                                            >
                                                                <FilePen className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    admin.id,
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
                                            colSpan={4}
                                            className="h-full p-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Users className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Admin
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Tambahkan admin baru untuk
                                                    membantu mengelola sistem.
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
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {admins.data.length > 0 && (
                    <CardFooter className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-semibold">
                                {admins.from || 0}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold">
                                {admins.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold">
                                {admins.total || 0}
                            </span>{' '}
                            hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {admins.links.map((link, index) =>
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
                            Tindakan ini akan menghapus akun admin secara
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
