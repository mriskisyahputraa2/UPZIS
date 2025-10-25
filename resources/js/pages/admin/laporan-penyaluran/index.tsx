import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Banknote,
    Calendar as CalendarIcon,
    Download,
    Eye,
    Search,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Laporan Penyaluran Bantuan' },
];

// Helper Functions
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);
const formatDate = (dateString: string) =>
    format(new Date(dateString), 'dd MMM yyyy', { locale: id });

const AlokasiBadge = ({ kategori }: { kategori: string }) => {
    let variant: 'info' | 'success' | 'default' | 'secondary' = 'secondary';
    let label = 'Tidak Diketahui';

    switch (kategori) {
        case 'kampus':
            variant = 'info';
            label = 'Zakat (Kampus)';
            break;
        case 'fakir_miskin':
            variant = 'success';
            label = 'Zakat (Fakir Miskin)';
            break;
        case 'infaq':
            variant = 'default';
            label = 'Infaq';
            break;
        case 'sedekah':
            variant = 'secondary';
            label = 'Sedekah';
            break;
    }
    return <Badge variant={variant}>{label}</Badge>;
};

const KategoriPenerimaBadge = ({ kategori }) => {
    if (!kategori) return null;
    const isMahasiswa = kategori === 'mahasiswa';
    return (
        <Badge variant={isMahasiswa ? 'info' : 'warning'}>
            {isMahasiswa ? 'Mahasiswa' : 'Fakir/Miskin'}
        </Badge>
    );
};

export default function Index({ penyalurans, summary, filters, periodes }) {
    const [search, setSearch] = useState(filters.search || '');
    const [periodeId, setPeriodeId] = useState(filters.periode_id || 'all');
    const [kategoriAlokasi, setKategoriAlokasi] = useState(
        filters.kategori_alokasi || 'all',
    );
    const [kategoriPenerima, setKategoriPenerima] = useState(
        filters.kategori_pemohon || 'all',
    );
    const [date, setDate] = useState({
        from: filters.start_date
            ? new Date(filters.start_date + 'T00:00:00')
            : undefined,
        to: filters.end_date
            ? new Date(filters.end_date + 'T00:00:00')
            : undefined,
    });
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = {
            search: search || undefined,
            periode_id: periodeId === 'all' ? undefined : periodeId,
            kategori_alokasi:
                kategoriAlokasi === 'all' ? undefined : kategoriAlokasi,
            kategori_pemohon:
                kategoriPenerima === 'all' ? undefined : kategoriPenerima,
            start_date: date?.from ? format(date.from, 'y-MM-dd') : undefined,
            end_date: date?.to ? format(date.to, 'y-MM-dd') : undefined,
            per_page: filters.per_page,
        };

        const timeout = setTimeout(() => {
            router.get('/admin/laporan-penyaluran', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, periodeId, kategoriAlokasi, kategoriPenerima, date]);

    const resetFilters = () => {
        setSearch('');
        setPeriodeId('all');
        setKategoriAlokasi('all');
        setKategoriPenerima('all');
        setDate({ from: undefined, to: undefined });
    };

    const handlePerPageChange = (perPage: string) => {
        router.get(
            '/admin/laporan-penyaluran',
            { ...filters, per_page: perPage },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const getExportUrl = (format: 'excel' | 'pdf') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (periodeId !== 'all') params.append('periode_id', periodeId);
        if (kategoriAlokasi !== 'all')
            params.append('kategori_alokasi', kategoriAlokasi);
        if (kategoriPenerima !== 'all')
            params.append('kategori_pemohon', kategoriPenerima);
        if (date?.from)
            params.append('start_date', format(date.from, 'y-MM-dd'));
        if (date?.to) params.append('end_date', format(date.to, 'y-MM-dd'));

        const baseUrl =
            format === 'pdf'
                ? '/admin/laporan-penyaluran/export-pdf'
                : '/admin/laporan-penyaluran/export-excel';
        return `${baseUrl}?${params.toString()}`;
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Penyaluran Bantuan" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Laporan Penyaluran Bantuan</CardTitle>
                    <CardDescription>
                        Lacak dan audit semua dana yang telah disalurkan kepada
                        mustahik.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full flex-1 sm:max-w-xs">
                                <Input
                                    type="search"
                                    placeholder="Cari nama mustahik..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <Select
                                value={kategoriPenerima}
                                onValueChange={setKategoriPenerima}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kategori
                                    </SelectItem>
                                    <SelectItem value="mahasiswa">
                                        Mahasiswa
                                    </SelectItem>
                                    <SelectItem value="umum">
                                        Fakir/Miskin
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={kategoriAlokasi}
                                onValueChange={setKategoriAlokasi}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Sumber Dana" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Sumber Dana
                                    </SelectItem>
                                    <SelectItem value="kampus">
                                        Zakat (Kampus)
                                    </SelectItem>
                                    <SelectItem value="fakir_miskin">
                                        Zakat (Fakir Miskin)
                                    </SelectItem>
                                    <SelectItem value="infaq">Infaq</SelectItem>
                                    <SelectItem value="sedekah">
                                        Sedekah
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full justify-start text-left font-normal sm:w-auto',
                                            !date?.from &&
                                                'text-muted-foreground',
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(
                                                        date.from,
                                                        'LLL dd, y',
                                                    )}{' '}
                                                    -{' '}
                                                    {format(
                                                        date.to,
                                                        'LLL dd, y',
                                                    )}
                                                </>
                                            ) : (
                                                format(date.from, 'LLL dd, y')
                                            )
                                        ) : (
                                            <span>Pilih tanggal</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                        locale={id}
                                    />
                                </PopoverContent>
                            </Popover>
                            {(filters.search ||
                                filters.periode_id ||
                                filters.kategori_alokasi ||
                                filters.kategori_pemohon ||
                                filters.start_date) && (
                                <Button
                                    variant="destructive-outline"
                                    onClick={resetFilters}
                                >
                                    <X className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            )}
                        </div>
                        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
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
                                    <SelectItem value="25">25 Data</SelectItem>
                                    <SelectItem value="50">50 Data</SelectItem>
                                    <SelectItem value="100">
                                        100 Data
                                    </SelectItem>
                                </SelectContent>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Ekspor
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <a
                                                href={getExportUrl('excel')}
                                                target="_blank"
                                            >
                                                Ekspor ke Excel (.xlsx)
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a
                                                href={getExportUrl('pdf')}
                                                target="_blank"
                                            >
                                                Ekspor ke PDF (.pdf)
                                            </a>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Dana Disalurkan
                                </CardTitle>
                                <Banknote className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.totalAmount)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Jumlah Penerima Bantuan
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {summary.uniqueMustahik} Orang
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex-1 overflow-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        No.
                                    </TableHead>
                                    <TableHead>Penerima</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Sumber Dana</TableHead>
                                    <TableHead>Tgl. Penyaluran</TableHead>
                                    <TableHead>Dicatat Oleh</TableHead>
                                    <TableHead className="w-[120px] text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {penyalurans.data.length > 0 ? (
                                    penyalurans.data.map((p, index) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">
                                                {penyalurans.from + index}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {p.permohonan.mustahik.name}
                                            </TableCell>
                                            <TableCell>
                                                <KategoriPenerimaBadge
                                                    kategori={
                                                        p.permohonan
                                                            .kategori_pemohon
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(p.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <AlokasiBadge
                                                    kategori={
                                                        p.kategori_alokasi
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    p.distribution_date,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {p.admin.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/admin/permohonan/${p.permohonan_id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-48 text-center"
                                        >
                                            <p className="font-semibold">
                                                Tidak ada data penyaluran.
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Coba ubah filter atau catat
                                                penyaluran baru.
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {penyalurans.data.length > 0 && (
                    <CardFooter className="flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <strong>{penyalurans.from || 0}</strong>{' '}
                            - <strong>{penyalurans.to || 0}</strong> dari{' '}
                            <strong>{penyalurans.total || 0}</strong> hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {penyalurans.links.map((link, index) =>
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
        </AppLayout>
    );
}
