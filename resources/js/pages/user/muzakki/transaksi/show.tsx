import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function Show({ transaksi, paymentDetails }) {
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

            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Selesaikan Pembayaran Anda
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Order ID: {transaksi.order_id}
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl px-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Detail Pembayaran
                            </CardTitle>
                            <CardDescription>
                                Segera lakukan pembayaran sebelum batas waktu.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3 rounded-lg border bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                        {formatCurrency(transaksi.final_amount)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Metode
                                    </span>
                                    <Badge variant="outline">
                                        {transaksi.payment_method}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Status
                                    </span>
                                    <Badge>{transaksi.status}</Badge>
                                </div>
                            </div>

                            {instructions ? (
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-2 font-bold">
                                        Instruksi Pembayaran
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            Silakan lakukan pembayaran ke akun
                                            berikut:
                                        </p>
                                        <div className="rounded-md bg-gray-100 p-3">
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
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    Instruksi pembayaran untuk metode ini tidak
                                    ditemukan.
                                </div>
                            )}

                            {transaksi.status === 'Menunggu Pembayaran' && (
                                <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm">
                                        PENTING: Setelah melakukan pembayaran,
                                        harap segera unggah bukti pembayaran
                                        Anda untuk mempercepat proses
                                        verifikasi.
                                    </p>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter>
                            {transaksi.status === 'Menunggu Pembayaran' ? (
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
                                                        data.payment_proof.name
                                                    }
                                                >
                                                    {data.payment_proof.name}
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
                            ) : (
                                <div className="grid w-full gap-4 sm:grid-cols-2">
                                    <Link href="/dashboard">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali ke Dashboard
                                        </Button>
                                    </Link>
                                    <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2 text-center text-green-700">
                                        <CheckCircle className="h-5 w-5" />
                                        <p className="text-sm font-semibold">
                                            {transaksi.status === 'Berhasil'
                                                ? 'Pembayaran Berhasil'
                                                : 'Menunggu Verifikasi Admin'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
