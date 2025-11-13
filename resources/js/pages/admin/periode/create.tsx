import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import InfoCard from './partials/info-card';
import PeriodeForm from './partials/periode-form';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Periode', href: '/admin/periode' },
    { title: 'Tambah Periode' },
];

/**
 * @page CreatePeriode
 * @description Halaman untuk membuat data periode baru.
 * Halaman ini menggabungkan beberapa komponen parsial untuk membentuk form pembuatan periode.
 * @returns {JSX.Element}
 */
export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        start_date: null,
        end_date: null,
        status: 'Tidak Aktif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/periode', { onSuccess: () => reset() });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Periode" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Tambah Periode Baru"
                        description="Buat siklus pendaftaran baru untuk penyaluran bantuan."
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
                        submitText="Simpan Periode"
                        processingText="Menyimpan..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}