import AppLayout from '@/layouts/app-layout';
import { Admin, AdminForm as AdminFormType } from '@/types/admin';
import { Head, useForm } from '@inertiajs/react';
import { AdminForm } from './partials/AdminForm';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import SecurityInfoCard from './partials/security-info-card';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Manajemen Admin', href: '/admin/settings/admins' },
    { title: 'Edit' },
];

/**
 * @interface AdminsEditProps
 * @description Properti untuk halaman AdminsEdit.
 * @property {Admin} admin - Data admin yang akan diedit.
 */
interface AdminsEditProps {
    admin: Admin;
}

/**
 * @page AdminsEdit
 * @description Halaman untuk mengedit data akun admin.
 * @param {AdminsEditProps} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function AdminsEdit({ admin }: AdminsEditProps) {
    const { data, setData, put, errors, processing } = useForm<AdminFormType>({
        name: admin.name || '',
        email: admin.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/settings/admins/${admin.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Admin: ${admin.name}`} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Edit Admin"
                        description={`Perbarui detail untuk admin "${admin.name}".`}
                        backUrl="/admin/settings/admins"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            <AdminForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                isEdit={true}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <SecurityInfoCard />
                        </div>
                    </div>

                    <FormActions
                        processing={processing}
                        backUrl="/admin/settings/admins"
                        submitText="Simpan Perubahan"
                        processingText="Memperbarui..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}