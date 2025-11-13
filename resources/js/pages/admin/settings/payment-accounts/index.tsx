import AppLayout from '@/layouts/app-layout';
import { PaymentSettingsForm } from '@/types/payment-settings';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import FormActions from './partials/form-actions';
import Header from './partials/header';
import PaymentMethodCard from './partials/payment-method-card';

/**
 * @page PaymentAccountSettings
 * @description Halaman untuk mengelola pengaturan akun pembayaran.
 * @param {{ paymentSettings: PaymentSettingsForm }} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function PaymentAccountSettings({
    paymentSettings,
}: {
    paymentSettings: PaymentSettingsForm;
}) {
    const { flash } = usePage().props;

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengaturan' },
        { title: 'Akun Pembayaran' },
    ];

    const { data, setData, patch, errors, processing } =
        useForm<PaymentSettingsForm>({
            dana: paymentSettings.dana || {
                account: '',
                name: '',
                steps: [''],
            },
            gopay: paymentSettings.gopay || {
                account: '',
                name: '',
                steps: [''],
            },
            tunai: paymentSettings.tunai || {
                account: '',
                name: '',
                steps: [''],
            },
        });

    // Menampilkan notifikasi toast saat ada flash message
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success as string);
        }
    }, [flash]);

    // Handler untuk submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/settings/payment-accounts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Akun Pembayaran" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Header />
                <form onSubmit={handleSubmit} className="space-y-8">
                    <PaymentMethodCard
                        methodKey="dana"
                        title="Akun DANA"
                        description="Atur detail akun dan instruksi pembayaran untuk metode DANA."
                        accountLabel="Nomor Akun DANA"
                        nameLabel="Nama Pemilik Akun"
                        data={data.dana}
                        setData={setData}
                        errors={errors}
                    />

                    <PaymentMethodCard
                        methodKey="gopay"
                        title="Akun GoPay"
                        description="Atur detail akun dan instruksi pembayaran untuk metode GoPay."
                        accountLabel="Nomor Akun GoPay"
                        nameLabel="Nama Pemilik Akun"
                        data={data.gopay}
                        setData={setData}
                        errors={errors}
                    />

                    <PaymentMethodCard
                        methodKey="tunai"
                        title="Pembayaran Tunai"
                        description="Atur detail lokasi dan instruksi untuk pembayaran tunai."
                        accountLabel="Nama Lokasi Setor (cth: Sekretariat UPZIS)"
                        nameLabel="Detail Alamat Lokasi"
                        data={data.tunai}
                        setData={setData}
                        errors={errors}
                    />

                    <FormActions processing={processing} />
                </form>
            </div>
        </AppLayout>
    );
}