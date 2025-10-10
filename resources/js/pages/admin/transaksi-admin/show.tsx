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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PaymentProofCard from './partials/PaymentProofCard';
import TransactionInfoPanel from './partials/TransactionInfoPanel';
import VerificationActions from './partials/VerificationActions';

export default function Show({ transaksi }) {
    const { flash } = usePage().props;
    const [isRejecting, setIsRejecting] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Transaksi', href: '/admin/transaksi' },
        { title: `Detail: ${transaksi.order_id}` },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleUpdateStatus = (newStatus) => {
        router.patch(
            `/admin/transaksi/${transaksi.id}`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRejecting(false);
                    if (newStatus === 'Berhasil' || newStatus === 'Gagal') {
                        router.visit('/admin/transaksi');
                    }
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi ${transaksi.order_id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/transaksi">
                        <Button
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">
                            Detail Verifikasi Transaksi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Periksa detail pembayaran untuk order{' '}
                            <strong>{transaksi.order_id}</strong>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 pt-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <PaymentProofCard transaksi={transaksi} />
                    </div>
                    <div className="sticky top-24 space-y-6 lg:col-span-1">
                        <TransactionInfoPanel transaksi={transaksi} />
                        {transaksi.status === 'Menunggu Verifikasi' && (
                            <VerificationActions
                                onApprove={() => handleUpdateStatus('Berhasil')}
                                onReject={() => setIsRejecting(true)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <AlertDialog open={isRejecting} onOpenChange={setIsRejecting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Konfirmasi Penolakan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menolak transaksi ini?
                            Status akan diubah menjadi "Gagal" dan tidak dapat
                            diubah kembali.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleUpdateStatus('Gagal')}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Ya, Tolak Transaksi
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
