import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm } from '@inertiajs/react';
import AmountInput from '../partials/AmountInput';
import DonationSummary from '../partials/DonationSummary';
import PageHeader from '../partials/PageHeader';
import PaymentMethodSelector from '../partials/PaymentMethodSelector';

export default function CreateInfaqSedekah({ donationType }) {
    const pageTitle =
        donationType.charAt(0).toUpperCase() + donationType.slice(1);

    const { data, setData, post, processing, errors } = useForm<{
        type: 'infaq' | 'sedekah';
        amount: string;
        payment_method: string;
    }>({
        type: donationType,
        amount: '',
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

    const quickAmounts = [25000, 50000, 100000, 200000];

    return (
        <PublicLayout>
            <Head title={`Bayar ${pageTitle}`} />

            <PageHeader
                title={`Tunaikan ${pageTitle} Anda`}
                description="Setiap donasi Anda memberikan harapan dan kebaikan bagi sesama."
            />

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
                                <AmountInput
                                    value={data.amount}
                                    onAmountChange={handleAmountChange}
                                    onQuickAmountClick={(amount) =>
                                        setData('amount', String(amount))
                                    }
                                    error={errors.amount}
                                    quickAmounts={quickAmounts}
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
