import AppLayout from '@/layouts/app-layout';
import { AdminForm as AdminFormType } from '@/types/admin';
import { Head, useForm } from '@inertiajs/react';
import { AdminForm } from './partials/AdminForm';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import SecurityInfoCard from './partials/security-info-card';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Manajemen Admin', href: '/admin/settings/admins' },
    { title: 'Tambah Baru' },
];

/**
 * @page AdminsCreate
 * @description Halaman untuk membuat akun admin baru.
 * @returns {JSX.Element}
 */
export default function AdminsCreate() {
    const { data, setData, post, errors, processing, reset } =
        useForm<AdminFormType>({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/admins', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Admin Baru" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Tambah Admin Baru"
                        description="Buat akun baru untuk memberikan akses ke panel admin."
                        backUrl="/admin/settings/admins"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            <AdminForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <SecurityInfoCard />
                        </div>
                    </div>

                    <FormActions
                        processing={processing}
                        backUrl="/admin/settings/admins"
                        submitText="Simpan Admin"
                    />
                </form>
            </div>
        </AppLayout>
    );
}