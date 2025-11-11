import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calculator } from 'lucide-react';
import AmountInput from '../partials/AmountInput';
import DonationSummary from '../partials/DonationSummary';
import PageHeader from '../partials/PageHeader';
import PaymentMethodSelector from '../partials/PaymentMethodSelector';

export default function CreateZakat({ initialAmount }) {
    const { data, setData, post, processing, errors } = useForm<{
        type: 'zakat';
        amount: string;
        payment_method: string;
    }>({
        type: 'zakat',
        amount: initialAmount || '',
        payment_method: '',
    });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('amount', value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/donasi');
    };

    const quickAmounts = [100000, 250000, 500000, 1000000];

    return (
        <PublicLayout>
            <Head title="Bayar Zakat" />

            <PageHeader
                title="Tunaikan Zakat, Sucikan Harta"
                description="Satu langkah mudah untuk menyalurkan kebaikan Anda kepada yang berhak menerima."
            />

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl px-6">
                    <form onSubmit={submit}>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Formulir Pembayaran Zakat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Alert>
                                    <Calculator className="h-4 w-4" />
                                    <AlertTitle className="font-semibold">
                                        Belum Tahu Nominal Zakat Anda?
                                    </AlertTitle>
                                    <AlertDescription>
                                        Gunakan kalkulator kami untuk menghitung
                                        kewajiban zakat Anda secara akurat.{' '}
                                        <Link
                                            href="/kalkulator-zakat"
                                            className="font-bold text-primary underline underline-offset-2 hover:text-primary/80"
                                        >
                                            Buka Kalkulator Zakat
                                        </Link>
                                    </AlertDescription>
                                </Alert>

                                <AmountInput
                                    value={data.amount}
                                    onAmountChange={handleAmountChange}
                                    onQuickAmountClick={(amount) =>
                                        setData('amount', String(amount))
                                    }
                                    error={errors.amount}
                                    quickAmounts={quickAmounts}
                                    label="1. Masukkan Nominal Zakat (IDR)"
                                />

                                <Separator />

                                <PaymentMethodSelector
                                    selectedValue={data.payment_method}
                                    onSelect={(method) =>
                                        setData('payment_method', method)
                                    }
                                    error={errors.payment_method}
                                />

                                <DonationSummary
                                    amount={data.amount}
                                    paymentMethod={data.payment_method}
                                    donationType={data.type}
                                />
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
