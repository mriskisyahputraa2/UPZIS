import AppLayout from '@/layouts/app-layout';
import { SettingsForm } from '@/types/settings';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ContactInfoCard from './partials/contact-info-card';
import FinancialSettingsCard from './partials/financial-settings-card';
import FormActions from './partials/form-actions';
import Header from './partials/header';
import InfoCard from './partials/info-card';

/**
 * @interface GeneralSettingsProps
 * @description Properti untuk halaman GeneralSettings.
 * @property {SettingsForm} settings - Objek data pengaturan yang diterima dari backend.
 */
interface GeneralSettingsProps {
    settings: SettingsForm;
}

/**
 * @page GeneralSettings
 * @description Halaman untuk mengelola pengaturan umum aplikasi.
 * @param {GeneralSettingsProps} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function GeneralSettings({ settings }: GeneralSettingsProps) {
    const { flash } = usePage().props;

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengaturan' },
        { title: 'Umum' },
    ];

    const { data, setData, patch, errors, processing } = useForm<SettingsForm>({
        harga_emas_per_gram: settings.harga_emas_per_gram || '',
        contact_address: settings.contact_address || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        alokasi_fakir_miskin_persen:
            settings.alokasi_fakir_miskin_persen || '10',
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
        patch('/admin/settings/general');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Umum" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <Header />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="space-y-8 lg:col-span-2">
                            <FinancialSettingsCard
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                            <ContactInfoCard
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <InfoCard />
                        </div>
                    </div>

                    <FormActions processing={processing} />
                </form>
            </div>
        </AppLayout>
    );
}