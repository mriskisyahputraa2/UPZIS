import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import PhotoManager from './partials/photo-manager';
import ProgramDetailsForm from './partials/program-details-form';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Program', href: '/admin/programs' },
    { title: 'Tambah Program' },
];

/**
 * @page CreateProgram
 * @description Halaman untuk membuat program penyaluran baru.
 * @returns {JSX.Element}
 */
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        program_date: new Date().toISOString().slice(0, 10),
        status: 'Draft',
        photos: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/programs', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Program Baru" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Buat Program Baru"
                        description="Lengkapi detail dan dokumentasi untuk program penyaluran."
                        backUrl="/admin/programs"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <ProgramDetailsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <PhotoManager setData={setData} errors={errors} />
                        </div>
                    </div>

                    <FormActions
                        processing={processing}
                        backUrl="/admin/programs"
                        submitText="Simpan & Lanjutkan"
                        processingText="Menyimpan..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}