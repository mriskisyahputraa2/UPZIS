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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm } from '@inertiajs/react';
import { CreditCard, Landmark, Wallet } from 'lucide-react';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
};

export default function CreateTransaksi({ auth, initialAmount }) {
    const { data, setData, post, processing, errors } = useForm({
        // Menggunakan nilai dari controller sebagai nilai awal
        amount: initialAmount || '',
        payment_method: '',
    });

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('amount', value);
    };

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan URL manual tanpa helper Ziggy
        post('/bayar-zakat');
    };

    return (
        <PublicLayout>
            <Head title="Bayar Zakat" />

            {/* Section untuk Header Halaman */}
            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Formulir Pembayaran Zakat
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Isi nominal dan pilih metode pembayaran yang Anda
                        inginkan.
                    </p>
                </div>
            </section>

            {/* Section untuk Konten Form */}
            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl px-6">
                    <Card className="shadow-lg">
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Tunaikan Zakat Anda
                                </CardTitle>
                                <CardDescription>
                                    Lengkapi detail pembayaran di bawah ini.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="amount"
                                        className="font-bold"
                                    >
                                        Nominal Zakat (IDR)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                                            Rp
                                        </span>
                                        <Input
                                            id="amount"
                                            type="text"
                                            value={formatCurrency(data.amount)}
                                            onChange={handleAmountChange}
                                            className="h-12 pr-4 pl-10 text-lg font-semibold"
                                            placeholder="Minimal 10.000"
                                        />
                                    </div>
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="font-bold">
                                        Metode Pembayaran
                                    </Label>
                                    <RadioGroup
                                        value={data.payment_method}
                                        onValueChange={(value) =>
                                            setData('payment_method', value)
                                        }
                                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                                    >
                                        {['DANA', 'GoPay', 'Tunai'].map(
                                            (method) => (
                                                <Label
                                                    key={method}
                                                    htmlFor={method}
                                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${data.payment_method === method ? 'border-primary' : ''}`}
                                                >
                                                    <RadioGroupItem
                                                        value={method}
                                                        id={method}
                                                        className="sr-only"
                                                    />
                                                    {method === 'DANA' && (
                                                        <Wallet className="mb-3 h-6 w-6" />
                                                    )}
                                                    {method === 'GoPay' && (
                                                        <CreditCard className="mb-3 h-6 w-6" />
                                                    )}
                                                    {method === 'Tunai' && (
                                                        <Landmark className="mb-3 h-6 w-6" />
                                                    )}
                                                    {method}
                                                </Label>
                                            ),
                                        )}
                                    </RadioGroup>
                                    {errors.payment_method && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.payment_method}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full text-base font-bold"
                                    size="lg"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Memproses...'
                                        : 'Lanjutkan Pembayaran'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
