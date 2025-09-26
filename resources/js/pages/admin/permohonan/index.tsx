import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, Eye, FileText, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan' },
];

// Fungsi untuk styling <SelectTrigger> berdasarkan status
const getStatusTriggerClass = (status) => {
    switch (status) {
        case 'Baru':
            return 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Diverifikasi':
            return 'border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Disetujui':
            return 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Ditolak':
            return 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default:
            return '';
    }
};

export default function Index({ permohonans, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRows, setSelectedRows] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

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

    const handleRowSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((rowId) => rowId !== id)
                : [...prev, id],
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? permohonans.data.map((p) => p.id) : []);
    };

    const handleInlineStatusChange = (id, newStatus) => {
        router.patch(
            `/admin/permohonan/${id}`,
            { status: newStatus },
            {
                preserveState: true,
                preserveScroll: true,
                onError: () => toast.error('Gagal memperbarui status.'),
            },
        );
    };

    const handleBulkUpdate = () => {
        if (selectedRows.length === 0 || !bulkStatus) {
            toast.error(
                'Pilih minimal satu permohonan dan tentukan statusnya.',
            );
            return;
        }
        router.post(
            `/admin/permohonan/bulk-update-status`,
            {
                ids: selectedRows,
                status: bulkStatus,
            },
            {
                preserveState: false, // <-- Ini kunci untuk auto-refresh
                onSuccess: () => setSelectedRows([]),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Permohonan" />

            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Daftar Permohonan Bantuan</CardTitle>
                    <CardDescription>
                        Verifikasi dan kelola semua permohonan bantuan yang
                        masuk.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full flex-1 sm:max-w-xs">
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau NIK..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            {selectedRows.length > 0 && (
                                <>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        ({selectedRows.length} dipilih)
                                    </span>
                                    <Select onValueChange={setBulkStatus}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Ubah Status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Baru">
                                                Baru
                                            </SelectItem>
                                            <SelectItem value="Diverifikasi">
                                                Diverifikasi
                                            </SelectItem>
                                            <SelectItem value="Disetujui">
                                                Disetujui
                                            </SelectItem>
                                            <SelectItem value="Ditolak">
                                                Ditolak
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleBulkUpdate}
                                        size="sm"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                        Terapkan
                                    </Button>
                                </>
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
                            <TableHeader className="uppercase">
                                <TableRow>
                                    <TableHead className="w-12 px-4">
                                        <Checkbox
                                            checked={
                                                permohonans.data.length > 0 &&
                                                selectedRows.length ===
                                                    permohonans.data.length
                                            }
                                            onCheckedChange={handleSelectAll}
                                            aria-label="Pilih semua"
                                        />
                                    </TableHead>
                                    <TableHead className="w-[50px]">
                                        No.
                                    </TableHead>
                                    <TableHead className="min-w-[150px]">
                                        Nama Pemohon
                                    </TableHead>
                                    <TableHead className="min-w-[150px]">
                                        Periode
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">
                                        Tgl. Pengajuan
                                    </TableHead>
                                    <TableHead className="w-48">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permohonans.data.length > 0 ? (
                                    permohonans.data.map(
                                        (permohonan, index) => (
                                            <TableRow
                                                key={permohonan.id}
                                                data-state={
                                                    selectedRows.includes(
                                                        permohonan.id,
                                                    ) && 'selected'
                                                }
                                            >
                                                <TableCell className="px-4">
                                                    <Checkbox
                                                        checked={selectedRows.includes(
                                                            permohonan.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            handleRowSelect(
                                                                permohonan.id,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
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
                                                    <Select
                                                        defaultValue={
                                                            permohonan.status
                                                        }
                                                        onValueChange={(
                                                            newStatus,
                                                        ) =>
                                                            handleInlineStatusChange(
                                                                permohonan.id,
                                                                newStatus,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={getStatusTriggerClass(
                                                                permohonan.status,
                                                            )}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Baru">
                                                                Baru
                                                            </SelectItem>
                                                            <SelectItem value="Diverifikasi">
                                                                Diverifikasi
                                                            </SelectItem>
                                                            <SelectItem value="Disetujui">
                                                                Disetujui
                                                            </SelectItem>
                                                            <SelectItem value="Ditolak">
                                                                Ditolak
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                                            colSpan={7}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                                                <h3 className="text-xl font-bold">
                                                    Belum Ada Permohonan
                                                </h3>
                                                <p className="text-gray-500">
                                                    Saat ini belum ada
                                                    permohonan bantuan yang
                                                    masuk.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {permohonans.data.length > 0 && (
                    <CardFooter className="flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <strong>{permohonans.from || 0}</strong>{' '}
                            - <strong>{permohonans.to || 0}</strong> dari{' '}
                            <strong>{permohonans.total || 0}</strong> hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {permohonans.links.map((link, index) => (
                                    <PaginationItem key={index}>
                                        {link.label.includes('Previous') ? (
                                            <PaginationPrevious
                                                href={link.url}
                                                preserveScroll
                                            />
                                        ) : link.label.includes('Next') ? (
                                            <PaginationNext
                                                href={link.url}
                                                preserveScroll
                                            />
                                        ) : (
                                            <PaginationLink
                                                href={link.url}
                                                isActive={link.active}
                                                preserveScroll
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                )}
            </Card>
        </AppLayout>
    );
}
