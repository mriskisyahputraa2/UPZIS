import AppLayout from '@/layouts/app-layout';
import { ZakatTypeForm as ZakatTypeFormType } from '@/types/zakat-type';
import { Head, useForm } from '@inertiajs/react';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import InfoCard from './partials/info-card';
import { ZakatTypeForm } from './partials/ZakatTypeForm';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Jenis Zakat', href: '/admin/settings/zakat-types' },
    { title: 'Tambah Baru' },
];

/**
 * @page ZakatTypesCreate
 * @description Halaman untuk membuat jenis zakat baru.
 * @returns {JSX.Element}
 */
export default function ZakatTypesCreate() {
    const { data, setData, post, errors, processing, reset } =
        useForm<ZakatTypeFormType>({
            name: '',
            description: '',
            rate_percent: '2.5',
            nisab_basis: 'emas',
            nisab_quantity: '85',
            status: 'Aktif',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/zakat-types', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Jenis Zakat" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Tambah Jenis Zakat Baru"
                        description="Buat jenis zakat baru untuk perhitungan di kalkulator."
                        backUrl="/admin/settings/zakat-types"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            <ZakatTypeForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <InfoCard />
                        </div>
                    </div>

                    <FormActions
                        processing={processing}
                        backUrl="/admin/settings/zakat-types"
                        submitText="Simpan Jenis Zakat"
                    />
                </form>
            </div>
        </AppLayout>
    );
}