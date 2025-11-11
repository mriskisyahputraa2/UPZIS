import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ContactsTable from './partials/ContactsTable';
import DeleteContactDialog from './partials/DeleteContactDialog';
import FilterPanel from './partials/FilterPanel';
import PaginationFooter from './partials/PaginationFooter';

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
        if (flash?.success) {
            toast.success(flash.success);
        }
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
                    <FilterPanel
                        search={search}
                        setSearch={setSearch}
                        status={status}
                        setStatus={setStatus}
                        resetFilters={resetFilters}
                        filters={filters}
                        handlePerPageChange={handlePerPageChange}
                    />
                    <ContactsTable
                        contacts={contacts}
                        onDelete={setDeleteTarget}
                    />
                </CardContent>
                <CardFooter>
                    <PaginationFooter contacts={contacts} />
                </CardFooter>
            </Card>
            <DeleteContactDialog
                isOpen={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                contact={deleteTarget}
            />
        </AppLayout>
    );
}
