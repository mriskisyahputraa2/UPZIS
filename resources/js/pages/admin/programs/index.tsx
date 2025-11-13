import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { PaginatedPrograms, Periode, ProgramListItem } from '@/types/program';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from './partials/delete-dialog';
import Header from './partials/header';
import Pagination from './partials/pagination';
import ProgramTable from './partials/program-table';
import TableToolbar from './partials/table-toolbar';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Program' },
];

/**
 * @interface IndexProps
 * @description Properti untuk halaman Index Program.
 */
interface IndexProps {
    programs: PaginatedPrograms;
    filters: {
        search?: string;
        status?: string;
        periode_id?: string;
        per_page?: string;
    };
    periodes: Periode[];
}

/**
 * @page ProgramIndex
 * @description Halaman utama untuk manajemen program, menampilkan daftar program dengan filter.
 * @returns {JSX.Element}
 */
export default function Index({ programs, filters, periodes }: IndexProps) {
    const { flash } = usePage().props;
    const [deleteTarget, setDeleteTarget] = useState<ProgramListItem | null>(
        null,
    );

    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        status: filters.status || 'all',
        periode_id: filters.periode_id || 'all',
    });
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success as string);
        if (flash?.error) toast.error(flash.error as string);
    }, [flash]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = {
            search: localFilters.search || undefined,
            status:
                localFilters.status === 'all'
                    ? undefined
                    : localFilters.status,
            periode_id:
                localFilters.periode_id === 'all'
                    ? undefined
                    : localFilters.periode_id,
            per_page: filters.per_page,
        };

        const timeout = setTimeout(() => {
            router.get('/admin/programs', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [localFilters]);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setLocalFilters({
            search: '',
            status: 'all',
            periode_id: 'all',
        });
    };

    const handlePerPageChange = (perPage: string) => {
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
                <Header />
                <CardContent className="flex flex-1 flex-col">
                    <TableToolbar
                        filters={{ ...filters, ...localFilters }}
                        periodes={periodes}
                        onSearchChange={(v) => handleFilterChange('search', v)}
                        onStatusChange={(v) => handleFilterChange('status', v)}
                        onPeriodeChange={(v) =>
                            handleFilterChange('periode_id', v)
                        }
                        onPerPageChange={handlePerPageChange}
                        onResetFilters={resetFilters}
                    />
                    <ProgramTable
                        programs={programs}
                        onDeleteClick={setDeleteTarget}
                    />
                </CardContent>
                <Pagination
                    links={programs.links}
                    from={programs.from}
                    to={programs.to}
                    total={programs.total}
                    show={programs.data.length > 0}
                />
            </Card>
            <DeleteDialog
                target={deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}