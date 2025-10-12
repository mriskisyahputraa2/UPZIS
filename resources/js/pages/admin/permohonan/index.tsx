import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BulkActions from './partials/BulkActions';
import PermohonanFilters from './partials/PermohonanFilters';
import PermohonanTable from './partials/PermohonanTable';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan' },
];

export default function Index({
    permohonans,
    filters,
    periodes,
    activePeriode,
}) {
    const { flash } = usePage().props;
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

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

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/permohonan/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Permohonan" />

            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Daftar Calon Permohonan Bantuan</CardTitle>
                    <CardDescription>
                        Verifikasi dan kelola semua permohonan bantuan yang
                        masuk.
                    </CardDescription>
                    <div className="!mt-4">
                        {activePeriode ? (
                            <Alert variant="info">
                                <Info className="h-4 w-4" />
                                <AlertTitle>
                                    Periode Pendaftaran Aktif
                                </AlertTitle>
                                <AlertDescription>
                                    Saat ini sistem menampilkan permohonan untuk
                                    periode{' '}
                                    <strong className="text-green-600">
                                        {activePeriode.name}
                                    </strong>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="warning">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Tidak Ada Periode Aktif</AlertTitle>
                                <AlertDescription>
                                    Formulir pendaftaran publik saat ini sedang
                                    ditutup.{' '}
                                    <Button
                                        variant="link"
                                        asChild
                                        className="h-auto p-0"
                                    >
                                        <Link href="/admin/periode">
                                            Buka Manajemen Periode.
                                        </Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    <PermohonanFilters filters={filters} periodes={periodes} />

                    {selectedRows.length > 0 && (
                        <BulkActions
                            selectedRows={selectedRows}
                            onClearSelection={() => setSelectedRows([])}
                        />
                    )}

                    <PermohonanTable
                        permohonans={permohonans}
                        selectedRows={selectedRows}
                        onRowSelect={handleRowSelect}
                        onSelectAll={handleSelectAll}
                        onSetDeleteTarget={setDeleteTarget}
                    />
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

            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data permohonan untuk{' '}
                            <strong>{deleteTarget?.mustahik.name}</strong>{' '}
                            secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteTarget(null)}
                        >
                            Batal
                        </AlertDialogCancel>
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
