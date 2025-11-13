import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import FilterPanel from './partials/FilterPanel';
import PaginationFooter from './partials/PaginationFooter';
import ReportsTable from './partials/ReportsTable';
import SummaryCards from './partials/SummaryCards';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Daftar Laporan Penyaluran Bantuan' },
];

export default function Index({ penyalurans, summary, filters, periodes }) {
    // States for filters
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

    // Effect to fetch data when filters change
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

    const getExportUrl = (exportFormat: 'excel' | 'pdf') => {
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
            exportFormat === 'pdf'
                ? '/admin/laporan-penyaluran/export-pdf'
                : '/admin/laporan-penyaluran/export-excel';
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Laporan Penyaluran Bantuan" />
            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Daftar Laporan Penyaluran Bantuan</CardTitle>
                    <CardDescription>
                        Lacak dan audit semua dana yang telah disalurkan kepada
                        mustahik.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <FilterPanel
                        filters={filters}
                        setters={{
                            setSearch,
                            setKategoriPenerima,
                            setKategoriAlokasi,
                            setPeriodeId,
                            setDate,
                        }}
                        values={{
                            search,
                            kategoriPenerima,
                            kategoriAlokasi,
                            periodeId,
                            date,
                        }}
                        periodes={periodes}
                        resetFilters={resetFilters}
                        handlePerPageChange={handlePerPageChange}
                        getExportUrl={getExportUrl}
                    />

                    <SummaryCards summary={summary} />

                    <ReportsTable penyalurans={penyalurans} />
                </CardContent>
                <CardFooter>
                    <PaginationFooter links={penyalurans} />
                </CardFooter>
            </Card>
        </AppLayout>
    );
}
