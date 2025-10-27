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
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Circle,
    Loader,
    MapPin,
    Smartphone,
    Upload,
    User,
    Wallet,
    X,
    XCircle,
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
    if (status === 'Gagal' || status === 'Kadaluarsa') {
        return (
            <div className="flex items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <XCircle className="h-8 w-8 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Transaksi Gagal</h3>
                    <p className="text-sm">
                        {status === 'Kadaluarsa'
                            ? 'Waktu pembayaran untuk transaksi ini telah habis.'
                            : 'Pembayaran Anda gagal atau ditolak oleh admin.'}
                    </p>
                </div>
            </div>
        );
    }

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

// ## KOMPONEN BARU YANG "PINTAR" UNTUK MENAMPILKAN DETAIL PEMBAYARAN ##
const PaymentDetailsDisplay = ({ method, details }) => {
    if (!details) return null;

    // Jika metode pembayaran adalah Tunai
    if (method === 'Tunai') {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Wallet className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Setor ke:
                        </p>
                        <p className="font-semibold">{details.account}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Alamat:</p>
                        <p className="font-semibold">{details.name}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Untuk metode pembayaran lain (DANA, GoPay)
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">Atas Nama:</p>
                    <p className="font-semibold">{details.name}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Smartphone className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">Nomor Akun:</p>
                    <p className="font-semibold">{details.account}</p>
                </div>
            </div>
        </div>
    );
};

export default function Show({ transaksi, paymentDetails }) {
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null,
    });

    const getDonationTypeName = (type) => {
        if (!type || type === 'zakat') return 'Zakat';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };
    const donationTypeName = getDonationTypeName(transaksi.type);

    const getDonationTypeBadgeVariant = (type) => {
        if (type === 'zakat') return 'success';
        if (type === 'infaq') return 'info';
        return 'secondary';
    };

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('payment_proof', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
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

                            <div className="divide-y rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-muted-foreground">
                                        Jenis Donasi
                                    </span>
                                    <Badge
                                        variant={getDonationTypeBadgeVariant(
                                            transaksi.type,
                                        )}
                                    >
                                        {donationTypeName}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-muted-foreground">
                                        Tanggal
                                    </span>
                                    <span className="font-semibold">
                                        {transaksi.formatted_date}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-muted-foreground">
                                        Waktu
                                    </span>
                                    <span className="font-semibold">
                                        {transaksi.formatted_time}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-muted-foreground">
                                        Metode
                                    </span>
                                    <Badge variant="secondary">
                                        {transaksi.payment_method}
                                    </Badge>
                                </div>
                                <div className="flex flex-col items-start justify-between gap-1 py-3 sm:flex-row sm:items-center">
                                    <span className="text-muted-foreground">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-2xl font-bold">
                                        {formatCurrency(transaksi.final_amount)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {transaksi.status === 'Menunggu Pembayaran' && (
                        <>
                            {paymentDetails && (
                                <Card className="shadow-lg duration-500 animate-in fade-in">
                                    <CardHeader>
                                        <CardTitle>
                                            Instruksi Pembayaran
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 text-sm">
                                            <p>
                                                Silakan lakukan pembayaran ke
                                                akun berikut:
                                            </p>
                                            <div className="rounded-md bg-muted/30 p-4">
                                                {/* ## MENGGUNAKAN KOMPONEN PINTAR ## */}
                                                <PaymentDetailsDisplay
                                                    method={
                                                        transaksi.payment_method
                                                    }
                                                    details={paymentDetails}
                                                />
                                            </div>
                                            <ol className="list-inside list-decimal space-y-1 pt-2 text-muted-foreground">
                                                {paymentDetails.steps.map(
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

                    {transaksi.status === 'Menunggu Verifikasi' && (
                        <Alert
                            variant="default"
                            className="border-yellow-200 bg-yellow-50 text-yellow-800 shadow-lg"
                        >
                            <Loader className="h-4 w-4 animate-spin text-yellow-600" />
                            <AlertTitle className="font-bold">
                                Menunggu Verifikasi
                            </AlertTitle>
                            <AlertDescription>
                                Terima kasih, bukti pembayaran Anda telah kami
                                terima dan akan segera diverifikasi oleh tim
                                kami.
                            </AlertDescription>
                        </Alert>
                    )}

                    {transaksi.status === 'Berhasil' && (
                        <Alert
                            variant="default"
                            className="border-green-200 bg-green-50 text-green-800 shadow-lg"
                        >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="font-bold">
                                Pembayaran Berhasil
                            </AlertTitle>
                            <AlertDescription>
                                Terima kasih, {donationTypeName.toLowerCase()}{' '}
                                Anda telah kami terima dan akan segera kami
                                salurkan.
                            </AlertDescription>
                        </Alert>
                    )}

                    {(transaksi.status === 'Gagal' ||
                        transaksi.status === 'Kadaluarsa') && (
                        <Alert className="border-red-500/50 bg-red-50 shadow-lg">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="font-bold text-red-900">
                                Transaksi Gagal
                            </AlertTitle>
                            <AlertDescription className="text-red-700">
                                {transaksi.status === 'Kadaluarsa'
                                    ? 'Waktu pembayaran telah habis. Anda bisa membuat transaksi baru jika ingin melanjutkan.'
                                    : 'Pembayaran Anda gagal atau ditolak. Silakan coba lagi dengan membuat transaksi baru.'}
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
