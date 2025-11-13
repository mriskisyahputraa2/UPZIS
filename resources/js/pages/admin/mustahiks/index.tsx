import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Paginated, Periode } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from './partials/index/DeleteDialog';
import MustahikTable from './partials/index/MustahikTable';
import TableHeader from './partials/index/TableHeader';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik' },
];

interface IndexProps extends PageProps {
    mustahiks: Paginated<any>; // Ganti 'any' dengan tipe Mustahik
    filters: {
        search?: string;
        periode_id?: string;
        jenis_kelamin?: string;
        kategori_pemohon?: string;
        per_page?: string;
    };
    periodes: Periode[];
    activePeriode: Periode | null;
}

/**
 * @summary Halaman utama untuk manajemen data mustahik.
 * @description Menampilkan daftar mustahik dalam sebuah tabel dengan fitur filter,
 *              pencarian, paginasi, dan aksi (tambah, ekspor, edit, hapus).
 * @param {IndexProps} props - Properti halaman yang dikirim dari controller.
 * @returns {JSX.Element} Halaman manajemen mustahik.
 */
export default function Index({
    mustahiks,
    filters,
    periodes,
    activePeriode,
}: IndexProps) {
    const { flash } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [filterPeriode, setFilterPeriode] = useState(
        filters.periode_id || 'all',
    );
    const [filterJenisKelamin, setFilterJenisKelamin] = useState(
        filters.jenis_kelamin || 'all',
    );
    const [filterKategori, setFilterKategori] = useState(
        filters.kategori_pemohon || 'all',
    );
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const isInitialMount = useRef(true);

    const getExportUrl = (format: 'excel' | 'pdf') => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.kategori_pemohon)
            params.append('kategori_pemohon', filters.kategori_pemohon);
        if (filters.jenis_kelamin)
            params.append('jenis_kelamin', filters.jenis_kelamin);
        if (filters.periode_id) params.append('periode_id', filters.periode_id);

        const baseUrl =
            format === 'pdf'
                ? '/admin/mustahiks-export-pdf'
                : '/admin/mustahiks-export-excel';
        return `${baseUrl}?${params.toString()}`;
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
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
            jenis_kelamin:
                filterJenisKelamin === 'all' ? '' : filterJenisKelamin,
            kategori_pemohon: filterKategori === 'all' ? '' : filterKategori,
        };
        const timeout = setTimeout(() => {
            router.get('/admin/mustahiks', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, filterPeriode, filterJenisKelamin, filterKategori]);

    const handlePerPageChange = (perPage: string) => {
        router.get('/admin/mustahiks', { ...filters, per_page: perPage }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setFilterPeriode('all');
        setFilterJenisKelamin('all');
        setFilterKategori('all');
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
                <TableHeader
                    filters={filters}
                    periodes={periodes}
                    activePeriode={activePeriode}
                    search={search}
                    setSearch={setSearch}
                    filterPeriode={filterPeriode}
                    setFilterPeriode={setFilterPeriode}
                    filterKategori={filterKategori}
                    setFilterKategori={setFilterKategori}
                    filterJenisKelamin={filterJenisKelamin}
                    setFilterJenisKelamin={setFilterJenisKelamin}
                    resetFilters={resetFilters}
                    handlePerPageChange={handlePerPageChange}
                    getExportUrl={getExportUrl}
                />
                <CardContent className="flex flex-1 flex-col">
                    <MustahikTable
                        mustahiks={mustahiks}
                        setDeleteId={setDeleteId}
                    />
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

            <DeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                description="Tindakan ini akan menghapus data mustahik secara permanen dan tidak dapat dibatalkan."
            />
        </AppLayout>
    );
}