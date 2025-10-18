import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, CreditCard, Landmark, Wallet } from 'lucide-react';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function CreateInfaqSedekah({ donationType }) {
    // Membuat judul yang rapi (misal: "Infaq", "Sedekah")
    const pageTitle =
        donationType.charAt(0).toUpperCase() + donationType.slice(1);

    const { data, setData, post, processing, errors } = useForm({
        type: donationType, // 'infaq' atau 'sedekah' dari controller
        amount: '',
        payment_method: '',
    });

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('amount', value);
    };

    const submit = (e) => {
        e.preventDefault();
        // Mengirim data ke rute donasi yang baru
        post('/donasi');
    };

    const quickAmounts = [25000, 50000, 100000, 200000];

    return (
        <PublicLayout>
            <Head title={`Bayar ${pageTitle}`} />

            <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Tunaikan {pageTitle} Anda
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Setiap donasi Anda memberikan harapan dan kebaikan bagi
                        sesama.
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl px-6">
                    <form onSubmit={submit}>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Formulir {pageTitle}
                                </CardTitle>
                                <CardDescription>
                                    Masukkan nominal yang ingin Anda donasikan.
                                    Tidak ada batas minimum.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="amount"
                                        className="text-base font-bold"
                                    >
                                        1. Masukkan Nominal (IDR)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                                            Rp
                                        </span>
                                        <Input
                                            id="amount"
                                            type="text"
                                            value={new Intl.NumberFormat(
                                                'id-ID',
                                            ).format(data.amount || 0)}
                                            onChange={handleAmountChange}
                                            className="h-14 pr-4 pl-10 text-2xl font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.amount}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {quickAmounts.map((qAmount) => (
                                            <Button
                                                key={qAmount}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setData('amount', qAmount)
                                                }
                                            >
                                                {formatCurrency(qAmount)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label className="text-base font-bold">
                                        2. Pilih Metode Pembayaran
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                        {[
                                            { name: 'DANA', icon: Wallet },
                                            { name: 'GoPay', icon: CreditCard },
                                            { name: 'Tunai', icon: Landmark },
                                        ].map((method) => (
                                            <button
                                                key={method.name}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'payment_method',
                                                        method.name,
                                                    )
                                                }
                                                className={`flex h-24 flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                                                    data.payment_method ===
                                                    method.name
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                            >
                                                <method.icon className="h-8 w-8 text-muted-foreground" />
                                                <span className="mt-2 text-sm font-semibold">
                                                    {method.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.payment_method && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.payment_method}
                                        </p>
                                    )}
                                </div>

                                {data.amount > 0 && data.payment_method && (
                                    <Alert
                                        variant="default"
                                        className="border-green-200 bg-green-50"
                                    >
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">
                                            Ringkasan Donasi
                                        </AlertTitle>
                                        <AlertDescription className="text-green-700">
                                            Anda akan berdonasi sebesar{' '}
                                            <strong>
                                                {formatCurrency(data.amount)}
                                            </strong>{' '}
                                            melalui{' '}
                                            <strong>
                                                {data.payment_method}
                                            </strong>
                                            .
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full text-lg font-bold"
                                    size="lg"
                                    disabled={
                                        processing ||
                                        !data.amount ||
                                        !data.payment_method
                                    }
                                >
                                    Lanjutkan Pembayaran
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
