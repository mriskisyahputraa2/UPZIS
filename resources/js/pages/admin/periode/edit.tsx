import AppLayout from '@/layouts/app-layout';
import { Periode } from '@/types/periode';
import { Head, useForm } from '@inertiajs/react';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import InfoCard from './partials/info-card';
import PeriodeForm from './partials/periode-form';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Periode', href: '/admin/periode' },
    { title: 'Edit Periode' },
];

/**
 * @interface EditProps
 * @property {Periode} periode - Objek data periode yang akan diedit.
 */
interface EditProps {
    periode: Periode;
}

/**
 * @page EditPeriode
 * @description Halaman untuk mengedit data periode yang sudah ada.
 * Halaman ini menggunakan kembali komponen parsial yang sama dengan halaman pembuatan.
 * @param {EditProps} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function Edit({ periode }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: periode.name || '',
        description: periode.description || '',
        start_date: periode.start_date || null,
        end_date: periode.end_date || null,
        status: periode.status || 'Tidak Aktif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/periode/${periode.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Periode" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Edit Periode"
                        description={`Perbarui detail untuk periode "${periode.name}".`}
                        backUrl="/admin/periode"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            <PeriodeForm
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
                        backUrl="/admin/periode"
                        submitText="Perbarui Periode"
                        processingText="Memperbarui..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}