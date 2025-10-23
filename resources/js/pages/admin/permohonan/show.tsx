import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ApplicantProfileCard from './partials/ApplicantProfileCard';
import DistributionHistoryCard from './partials/DistributionHistoryCard';
import SubmissionDetailsCard from './partials/SubmissionDetailsCard';
import VerificationForm from './partials/VerificationForm';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan', href: '/admin/permohonan' },
    { title: 'Detail Permohonan' },
];

export default function Show({ permohonan, availableFunds }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Permohonan - ${permohonan.mustahik.name}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3">
                    <Link href="/admin/permohonan">
                        <Button
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Detail Permohonan</h1>
                        <p className="text-sm text-muted-foreground">
                            Verifikasi data untuk "{permohonan.mustahik.name}"
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <ApplicantProfileCard permohonan={permohonan} />
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        <SubmissionDetailsCard permohonan={permohonan} />
                        <DistributionHistoryCard
                            permohonan={permohonan}
                            availableFunds={availableFunds}
                        />
                        <VerificationForm permohonan={permohonan} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
