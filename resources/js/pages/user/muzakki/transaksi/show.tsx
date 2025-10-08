import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    Circle,
    Loader,
    Upload,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// Komponen Visual untuk Status Stepper
const StatusStepper = ({ status }) => {
    const steps = [
        { id: 'Menunggu Pembayaran', label: 'Lakukan Pembayaran' },
        { id: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi' },
        { id: 'Berhasil', label: 'Pembayaran Berhasil' },
    ];

    let currentStepIndex = steps.findIndex((step) => step.id === status);
    if (currentStepIndex < 0) {
        currentStepIndex = 0;
    }

    return (
        <div className="flex items-center justify-between text-sm">
            {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let icon = <Circle className="h-5 w-5 text-gray-300" />;
                if (isActive)
                    icon = <CheckCircle className="h-5 w-5 text-green-500" />;
                if (isCurrent && status !== 'Berhasil')
                    icon = (
                        <Loader className="h-5 w-5 animate-spin text-yellow-500" />
                    );

                return (
                    <div
                        key={step.id}
                        className="relative flex w-full flex-col items-center"
                    >
                        {index > 0 && (
                            <div
                                className={`absolute top-2.5 left-0 h-0.5 w-full -translate-x-1/2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                            ></div>
                        )}
                        <div className="relative z-10 rounded-full bg-white p-1 dark:bg-slate-900">
                            {icon}
                        </div>
                        <p
                            className={`mt-2 text-center text-xs sm:text-sm ${isActive ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                        >
                            {step.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default function Show({ transaksi, paymentDetails }) {
    // Guard Clause untuk mencegah error jika data belum ada
    if (!transaksi) {
        return (
            <PublicLayout>
                <Head title="Memuat Transaksi..." />
                <div className="flex min-h-screen items-center justify-center">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            </PublicLayout>
        );
    }

    const instructions = paymentDetails;
    const fileInputRef = useRef();

    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (data.payment_proof) {
            const newUrl = URL.createObjectURL(data.payment_proof);
            setPreviewUrl(newUrl);
            return () => URL.revokeObjectURL(newUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [data.payment_proof]);

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        setData('payment_proof', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/transaksi/${transaksi.order_id}/upload`, {
            onSuccess: () => setData('payment_proof', null),
        });
    };

    return (
        <PublicLayout>
            <Head title={`Detail Transaksi ${transaksi.order_id}`} />

            <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Detail Transaksi
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Selesaikan pembayaran Anda dan lihat statusnya di sini.
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl space-y-6 px-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Status Transaksi</CardTitle>
                            <CardDescription>
                                Order ID: {transaksi.order_id}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <StatusStepper status={transaksi.status} />
                            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-lg font-bold">
                                        {formatCurrency(transaksi.final_amount)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Metode
                                    </span>
                                    <Badge variant="secondary">
                                        {transaksi.payment_method}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {transaksi.status === 'Menunggu Pembayaran' && (
                        <>
                            {instructions && (
                                <Card className="shadow-lg duration-500 animate-in fade-in">
                                    <CardHeader>
                                        <CardTitle>
                                            Instruksi Pembayaran
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                Silakan lakukan pembayaran ke
                                                akun berikut:
                                            </p>
                                            <div className="rounded-md bg-muted/30 p-3">
                                                <p className="text-base font-semibold">
                                                    {instructions.account}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    a.n. {instructions.name}
                                                </p>
                                            </div>
                                            <ol className="list-inside list-decimal space-y-1 pt-2">
                                                {instructions.steps.map(
                                                    (step, i) => (
                                                        <li key={i}>{step}</li>
                                                    ),
                                                )}
                                            </ol>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="shadow-lg duration-500 animate-in fade-in">
                                <CardHeader>
                                    <CardTitle>
                                        Upload Bukti Pembayaran
                                    </CardTitle>
                                    <CardDescription>
                                        Setelah membayar, unggah bukti transfer
                                        Anda di sini untuk verifikasi.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="w-full space-y-4"
                                    >
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        {previewUrl && (
                                            <div className="space-y-2">
                                                <Label>
                                                    Preview Bukti Pembayaran
                                                </Label>
                                                <div className="relative w-full max-w-xs rounded-lg border p-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview Bukti Pembayaran"
                                                        className="h-auto w-full rounded-md object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                'payment_proof',
                                                                null,
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/75"
                                                        aria-label="Hapus gambar"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                {data.payment_proof && (
                                                    <p
                                                        className="truncate text-sm text-muted-foreground"
                                                        title={
                                                            data.payment_proof
                                                                .name
                                                        }
                                                    >
                                                        {
                                                            data.payment_proof
                                                                .name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {errors.payment_proof && (
                                            <p className="text-sm text-red-600">
                                                {errors.payment_proof}
                                            </p>
                                        )}
                                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                                onClick={handleFileSelect}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {previewUrl
                                                    ? 'Ganti File'
                                                    : 'Pilih File Bukti'}
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="w-full font-bold sm:flex-1"
                                                disabled={
                                                    !data.payment_proof ||
                                                    processing
                                                }
                                            >
                                                {processing
                                                    ? 'Mengunggah...'
                                                    : 'Kirim Bukti Pembayaran'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {transaksi.status !== 'Menunggu Pembayaran' && (
                        <Alert
                            variant="default"
                            className="border-green-200 bg-green-50 text-green-800 shadow-lg"
                        >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="font-bold">
                                {transaksi.status === 'Berhasil'
                                    ? 'Pembayaran Berhasil'
                                    : 'Menunggu Verifikasi'}
                            </AlertTitle>
                            <AlertDescription>
                                {transaksi.status === 'Berhasil'
                                    ? 'Terima kasih, zakat Anda telah kami terima dan akan segera kami salurkan.'
                                    : 'Terima kasih, bukti pembayaran Anda telah kami terima dan akan segera diverifikasi oleh tim kami.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="text-center">
                        <Link href="/profile">
                            <Button variant="ghost">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Riwayat Transaksi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
