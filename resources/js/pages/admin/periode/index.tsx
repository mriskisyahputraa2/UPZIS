import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { PaginatedPeriodes } from '@/types/periode';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from './partials/delete-dialog';
import Header from './partials/header';
import Pagination from './partials/pagination';
import PeriodeTable from './partials/periode-table';
import TableToolbar from './partials/table-toolbar';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Periode' },
];

/**
 * @interface IndexProps
 * @property {PaginatedPeriodes} periodes - Objek data periode yang dipaginasi.
 * @property {{ search: string; per_page: string }} filters - Filter yang diterapkan.
 */
interface IndexProps {
    periodes: PaginatedPeriodes;
    filters: { search: string; per_page: string };
}

/**
 * @page PeriodeIndex
 * @description Halaman utama untuk manajemen periode, menampilkan daftar periode.
 * @param {IndexProps} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function Index({ periodes, filters }: IndexProps) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const isInitialMount = useRef(true);

    // Menampilkan notifikasi toast dari flash message
    useEffect(() => {
        if (flash && flash.success) toast.success(flash.success as string);
        if (flash && flash.error) toast.error(flash.error as string);
    }, [flash]);

    // Melakukan pencarian dengan debounce saat nilai `search` berubah
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/periode',
                { search, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // Handler untuk mengubah jumlah data per halaman
    const handlePerPageChange = (perPage: string) => {
        router.get(
            '/admin/periode',
            { search: filters.search, per_page: perPage },
            { preserveState: true, replace: true },
        );
    };

    // Handler untuk konfirmasi penghapusan
    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/periode/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Periode" />
            <Card className="flex h-full flex-1 flex-col">
                <Header />
                <CardContent className="flex flex-1 flex-col">
                    <TableToolbar
                        search={search}
                        onSearchChange={setSearch}
                        perPage={String(filters.per_page || '5')}
                        onPerPageChange={handlePerPageChange}
                    />
                    <PeriodeTable
                        periodes={periodes}
                        onDeleteClick={setDeleteId}
                    />
                </CardContent>
                <Pagination periodes={periodes} />
            </Card>

            <DeleteDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}