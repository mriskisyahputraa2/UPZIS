import InputError from '@/components/input-error';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm } from '@inertiajs/react';
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
                if (isRejected && step.name === 'Disetujui') return null;
                if (!isRejected && step.isRejected) return null;

                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let Icon = isActive ? CheckCircle : step.icon;
                let iconColor = isActive
                    ? isRejected
                        ? 'text-red-500'
                        : 'text-green-500'
                    : 'text-gray-400';
                let textColor = isActive
                    ? isRejected
                        ? 'text-red-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    : 'text-gray-500';

                if (isCurrent && !step.isFinal) {
                    Icon = Loader;
                    iconColor = 'text-yellow-500';
                    textColor = 'text-yellow-600 font-semibold';
                }
                if (isCurrent && currentStatus === 'Ditolak') Icon = XCircle;

                return (
                    <div key={step.name} className="flex items-center gap-4">
                        <Icon
                            className={`h-6 w-6 flex-shrink-0 ${iconColor} ${
                                isCurrent && !step.isFinal ? 'animate-spin' : ''
                            }`}
                        />
                        <span className={`font-medium ${textColor}`}>
                            {step.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default function Lacak({ permohonan, filters }) {
    const { data, setData, get, processing, errors } = useForm({
        kode: filters.kode || '',
        identifier: filters.identifier || '',
    });

    const [activeTab, setActiveTab] = useState(
        filters.identifier ? 'dataDiri' : 'kodeUnik',
    );

    const handleSearch = (e) => {
        e.preventDefault();

        const params =
            activeTab === 'kodeUnik'
                ? { kode: data.kode }
                : { identifier: data.identifier };

        get('/lacak-status', {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });
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
                        Pantau progres permohonan bantuan Anda secara mandiri.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-2xl px-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid h-12 w-full grid-cols-2">
                            <TabsTrigger value="kodeUnik" className="text-base">
                                Dengan Kode Unik
                            </TabsTrigger>
                            <TabsTrigger value="dataDiri" className="text-base">
                                Dengan Data Diri
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="kodeUnik">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>
                                        Masukkan Kode Pendaftaran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSearch}
                                        className="flex flex-col items-start gap-4 sm:flex-row"
                                    >
                                        <div className="w-full space-y-2">
                                            <Label
                                                htmlFor="kode"
                                                className="sr-only"
                                            >
                                                Kode Unik
                                            </Label>
                                            <Input
                                                id="kode"
                                                value={data.kode}
                                                onChange={(e) =>
                                                    setData(
                                                        'kode',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: UPZ-17590..."
                                                className="h-12 text-lg"
                                            />
                                            <InputError message={errors.kode} />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="h-12 w-full text-base font-bold sm:w-auto"
                                        >
                                            {processing ? (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Search className="mr-2 h-4 w-4" />
                                            )}
                                            Lacak
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="dataDiri">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>
                                        Masukkan Data Diri Anda
                                    </CardTitle>
                                    <CardDescription>
                                        Anda bisa menggunakan NIK atau Nomor
                                        Handphone yang terdaftar.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSearch}
                                        className="flex flex-col items-start gap-4 sm:flex-row"
                                    >
                                        <div className="w-full space-y-2">
                                            <Label
                                                htmlFor="identifier"
                                                className="sr-only"
                                            >
                                                NIK atau No. HP
                                            </Label>
                                            <Input
                                                id="identifier"
                                                value={data.identifier}
                                                onChange={(e) =>
                                                    setData(
                                                        'identifier',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan NIK atau No. HP Anda..."
                                                className="h-12 text-lg"
                                            />
                                            <InputError
                                                message={errors.identifier}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="h-12 w-full text-base font-bold sm:w-auto"
                                        >
                                            {processing ? (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Search className="mr-2 h-4 w-4" />
                                            )}
                                            Lacak
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

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

                        {(filters.kode || filters.identifier) &&
                            !permohonan &&
                            !processing && (
                                <Card className="duration-500 animate-in fade-in">
                                    <CardContent className="p-10 text-center">
                                        <HelpCircle className="mx-auto h-16 w-16 text-gray-400" />
                                        <h2 className="mt-4 text-2xl font-bold">
                                            Data Tidak Ditemukan
                                        </h2>
                                        <p className="mt-2 text-muted-foreground">
                                            Pastikan kode atau data diri yang
                                            Anda masukkan sudah benar.
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
