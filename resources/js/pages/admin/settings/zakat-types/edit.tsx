import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import { ZakatTypeForm } from './partials/ZakatTypeForm';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan' },
    { title: 'Jenis Zakat', href: '/admin/settings/zakat-types' },
    { title: 'Edit' },
];

export default function ZakatTypesEdit({ jenisZakat }) {
    const { data, setData, put, errors, processing } = useForm({
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
                    <div className="flex items-center gap-3">
                        <Link href="/admin/settings/zakat-types">
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
                            <h1 className="text-xl font-bold">
                                Edit Jenis Zakat
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Perbarui detail untuk "{jenisZakat.name}".
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            <ZakatTypeForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader className="flex-row items-center gap-2 space-y-0 text-blue-500">
                                    <Info className="h-5 w-5" />
                                    <CardTitle>Informasi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                                        <p>
                                            <strong>Rate (%)</strong> adalah
                                            persentase yang akan dikalikan
                                            dengan harta muzakki. Umumnya 2.5%
                                            untuk zakat mal.
                                        </p>
                                        <p>
                                            <strong>Nisab</strong> adalah batas
                                            minimum harta wajib zakat. Basis
                                            nisab (emas, perak, dll.) akan
                                            ditampilkan sebagai satuan.
                                        </p>
                                        <p>
                                            Status{' '}
                                            <strong>"Tidak Aktif"</strong> akan
                                            menyembunyikan jenis zakat ini dari
                                            pilihan di kalkulator zakat.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/settings/zakat-types">
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
