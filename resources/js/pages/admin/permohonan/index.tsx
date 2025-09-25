// resources/js/Pages/Admin/Permohonan/Index.jsx

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
import { Eye, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan' },
];

const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'Baru':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Diverifikasi':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Disetujui':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Ditolak':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
};

export default function Index({ permohonans, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/permohonan',
                { search, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/permohonan',
            { search: filters.search, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Permohonan" />

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Permohonan Bantuan</CardTitle>
                    </div>
                    <CardDescription>
                        Verifikasi dan kelola semua permohonan bantuan yang
                        masuk.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="search"
                                placeholder="Cari nama atau NIK pemohon..."
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
                                    <TableHead>Nama Pemohon</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Tgl. Pengajuan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permohonans.data.length > 0 ? (
                                    permohonans.data.map(
                                        (permohonan, index) => (
                                            <TableRow key={permohonan.id}>
                                                <TableCell className="font-medium">
                                                    {permohonans.from + index}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {permohonan.mustahik.name}
                                                </TableCell>
                                                <TableCell>
                                                    {permohonan.periode.name}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        permohonan.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusBadgeColor(
                                                            permohonan.status,
                                                        )}
                                                    >
                                                        {permohonan.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={`/admin/permohonan/${permohonan.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />{' '}
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            Tidak ada data permohonan ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter>
                    {/* <PaginationComponent meta={permohonans} /> */}
                    <Pagination>
                        <PaginationContent>
                            {permohonans.links.map((link, index) => {
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
        </AppLayout>
    );
}
