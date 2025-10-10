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
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react'; // Import useState
import { toast } from 'sonner';
import TransactionFilters from './partials/TransactionFilters';
import TransactionTable from './partials/TransactionTable';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Transaksi' },
];

export default function Index({ transaksis, filters }) {
    const { flash } = usePage().props;

    // Tambahkan state untuk loading
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleInlineStatusChange = (id, newStatus) => {
        router.patch(
            `/admin/transaksi/${id}`,
            { status: newStatus },
            {
                preserveScroll: true,
                only: ['transaksis', 'flash'],
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onError: () => toast.error('Gagal memperbarui status.'),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Transaksi" />

            <Card className="flex h-full flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Daftar Verifikasi Transaksi Muzakki</CardTitle>
                    <CardDescription>
                        Kelola dan verifikasi semua transaksi pembayaran zakat
                        yang masuk.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                    {/* Kirim setIsLoading sebagai prop */}
                    <TransactionFilters
                        filters={filters}
                        setIsLoading={setIsLoading}
                    />

                    {/* Kirim isLoading sebagai prop */}
                    <TransactionTable
                        transaksis={transaksis}
                        handleInlineStatusChange={handleInlineStatusChange}
                        isLoading={isLoading}
                    />
                </CardContent>

                {transaksis.data.length > 0 && (
                    <CardFooter className="flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <strong>{transaksis.from || 0}</strong>{' '}
                            - <strong>{transaksis.to || 0}</strong> dari{' '}
                            <strong>{transaksis.total || 0}</strong> hasil
                        </div>
                        <Pagination>
                            <PaginationContent>
                                {transaksis.links.map((link, index) => (
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
