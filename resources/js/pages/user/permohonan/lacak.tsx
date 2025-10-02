// resources/js/Pages/user/permohonan/lacak.jsx

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/publicLayout';
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle,
    Circle,
    HelpCircle,
    Loader,
    Search,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

// Komponen Stepper Status Visual
const StatusStepper = ({ currentStatus }) => {
    const steps = [
        { name: 'Baru', icon: Circle },
        { name: 'Diverifikasi', icon: Circle },
        { name: 'Disetujui', icon: CheckCircle, isFinal: true },
        { name: 'Ditolak', icon: XCircle, isFinal: true, isRejected: true },
    ];

    const currentStepIndex = steps.findIndex(
        (step) => step.name === currentStatus,
    );
    const isRejected = currentStatus === 'Ditolak';

    return (
        <div className="space-y-4">
            {steps.map((step, index) => {
                if (isRejected && step.name === 'Disetujui') return null; // Sembunyikan 'Disetujui' jika ditolak
                if (!isRejected && step.isRejected) return null; // Sembunyikan 'Ditolak' jika tidak ditolak

                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let Icon = step.icon;
                let iconColor = 'text-gray-400';
                let textColor = 'text-gray-500';

                if (isActive) {
                    Icon = CheckCircle;
                    iconColor = isRejected ? 'text-red-500' : 'text-green-500';
                    textColor = isRejected
                        ? 'text-red-600 font-semibold'
                        : 'text-green-600 font-semibold';
                }
                if (isCurrent) {
                    Icon = isRejected ? XCircle : Loader;
                    if (
                        currentStatus === 'Baru' ||
                        currentStatus === 'Diverifikasi'
                    )
                        Icon = Loader;
                    if (currentStatus === 'Disetujui') Icon = CheckCircle;
                }

                return (
                    <div key={step.name} className="flex items-center gap-4">
                        <Icon
                            className={`h-6 w-6 flex-shrink-0 ${iconColor} ${isCurrent && !step.isFinal ? 'animate-spin' : ''}`}
                        />
                        <span
                            className={`font-medium ${isActive ? textColor : 'text-gray-400'}`}
                        >
                            {step.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default function Lacak({ permohonan, filters }) {
    const [kode, setKode] = useState(filters.kode || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(
            '/lacak-status',
            { kode },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <PublicLayout>
            <Head title="Lacak Status Permohonan" />

            <section className="bg-green-700 pt-32 pb-16 text-white">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Lacak Status Permohonan
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Masukkan kode unik pendaftaran Anda untuk melihat
                        progres permohonan.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Masukkan Kode Pendaftaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col items-start gap-4 sm:flex-row"
                            >
                                <div className="w-full space-y-2">
                                    <Label htmlFor="kode" className="sr-only">
                                        Kode Unik
                                    </Label>
                                    <Input
                                        id="kode"
                                        value={kode}
                                        onChange={(e) =>
                                            setKode(e.target.value)
                                        }
                                        placeholder="Contoh: UPZ-17590..."
                                        className="h-12 text-lg"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isLoading}
                                    className="h-12 w-full text-base font-bold sm:w-auto"
                                >
                                    {isLoading ? (
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="mr-2 h-4 w-4" />
                                    )}
                                    Lacak
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tampilan Hasil Pencarian */}
                    <div className="mt-8">
                        {permohonan && (
                            <Card className="duration-500 animate-in fade-in">
                                <CardHeader>
                                    <CardTitle>Hasil Ditemukan</CardTitle>
                                    <CardDescription>
                                        Status terakhir untuk permohonan atas
                                        nama{' '}
                                        <strong>
                                            {permohonan.mustahik.name}
                                        </strong>{' '}
                                        pada periode{' '}
                                        <strong>
                                            {permohonan.periode.name}
                                        </strong>
                                        .
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <StatusStepper
                                        currentStatus={permohonan.status}
                                    />
                                    {permohonan.notes_admin && (
                                        <div className="mt-6 rounded-lg border bg-gray-50 p-4">
                                            <h4 className="font-semibold">
                                                Catatan dari Admin:
                                            </h4>
                                            <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                                                {permohonan.notes_admin}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {filters.kode && !permohonan && !isLoading && (
                            <Card className="duration-500 animate-in fade-in">
                                <CardContent className="p-10 text-center">
                                    <HelpCircle className="mx-auto h-16 w-16 text-gray-400" />
                                    <h2 className="mt-4 text-2xl font-bold">
                                        Data Tidak Ditemukan
                                    </h2>
                                    <p className="mt-2 text-muted-foreground">
                                        Pastikan kode pendaftaran yang Anda
                                        masukkan sudah benar.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
