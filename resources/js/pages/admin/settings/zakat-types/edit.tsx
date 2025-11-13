import AppLayout from '@/layouts/app-layout';
import {
    ZakatType,
    ZakatTypeForm as ZakatTypeFormType,
} from '@/types/zakat-type';
import { Head, useForm } from '@inertiajs/react';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import InfoCard from './partials/info-card';
import { ZakatTypeForm } from './partials/ZakatTypeForm';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Jenis Zakat', href: '/admin/settings/zakat-types' },
    { title: 'Edit' },
];

/**
 * @interface ZakatTypesEditProps
 * @description Properti untuk halaman ZakatTypesEdit.
 * @property {ZakatType} jenisZakat - Data jenis zakat yang akan diedit.
 */
interface ZakatTypesEditProps {
    jenisZakat: ZakatType;
}

/**
 * @page ZakatTypesEdit
 * @description Halaman untuk mengedit data jenis zakat.
 * @param {ZakatTypesEditProps} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function ZakatTypesEdit({ jenisZakat }: ZakatTypesEditProps) {
    const { data, setData, put, errors, processing } =
        useForm<ZakatTypeFormType>({
            name: jenisZakat.name || '',
            description: jenisZakat.description || '',
            rate_percent: jenisZakat.rate_percent || '2.5',
            nisab_basis: jenisZakat.nisab_basis || 'emas',
            nisab_quantity: jenisZakat.nisab_quantity || '85',
            status: jenisZakat.status || 'Aktif',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/settings/zakat-types/${jenisZakat.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Jenis Zakat: ${jenisZakat.name}`} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Edit Jenis Zakat"
                        description={`Perbarui detail untuk "${jenisZakat.name}".`}
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
                        submitText="Simpan Perubahan"
                        processingText="Memperbarui..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}