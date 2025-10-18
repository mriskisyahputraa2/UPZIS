import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import { AdminForm } from './partials/AdminForm';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Manajemen Admin', href: '/admin/settings/admins' },
    { title: 'Edit' },
];

export default function AdminsEdit({ admin }) {
    const { data, setData, put, errors, processing } = useForm({
        name: admin.name || '',
        email: admin.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/settings/admins/${admin.id}`);
    };
    // Karakter backtick (`) yang salah sudah dihapus dari baris ini.

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Admin: ${admin.name}`} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/settings/admins">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Edit Admin</h1>
                            <p className="text-sm text-muted-foreground">
                                Perbarui detail untuk admin "{admin.name}".
                            </p>
                        </div>
                    </div>

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
                            <Card>
                                <CardHeader className="flex-row items-center gap-2 space-y-0 text-yellow-600">
                                    <Info className="h-5 w-5" />
                                    <CardTitle>Keamanan Akun</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                                        <p>
                                            Pastikan Anda menggunakan{' '}
                                            <strong>password yang kuat</strong>{' '}
                                            dan unik untuk setiap akun admin.
                                        </p>
                                        <p>
                                            Alamat email harus{' '}
                                            <strong>unik</strong> dan belum
                                            pernah terdaftar di sistem ini
                                            sebagai pengguna lain.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/settings/admins">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
