import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Import file partials yang baru dibuat
import StrukturOrganisasiForm from './partials/StrukturOrganisasiForm';
import StrukturOrganisasiInfo from './partials/StrukturOrganisasiInfo';

export default function EditStrukturOrganisasi({ dataStruktur }) {
    const { flash } = usePage().props;
    const [preview, setPreview] = useState(dataStruktur?.gambar_url || null);

    // Semua state dan logika tetap di halaman utama
    const { data, setData, post, processing, errors } = useForm({
        gambar: null,
        keterangan: dataStruktur?.keterangan || '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success as string);
        }
        if (flash?.error) {
            toast.error(flash.error as string);
        }
    }, [flash]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('gambar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/struktur-organisasi', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Pengaturan', href: '#' },
                {
                    title: 'Struktur Organisasi',
                    href: '/admin/struktur-organisasi',
                },
            ]}
        >
            <Head title="Struktur Organisasi" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    {/* Header Halaman */}
                    <div>
                        <h1 className="text-xl font-bold">
                            Struktur Organisasi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui gambar dan keterangan struktur organisasi
                            Anda.
                        </p>
                    </div>

                    {/* Layout Grid 2 Kolom (Menggunakan Partials) */}
                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        {/* Meneruskan semua props yang diperlukan ke partial form */}
                        <StrukturOrganisasiForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            preview={preview}
                            handleFileChange={handleFileChange}
                        />

                        {/* Kolom Kanan: Kartu Informasi Sticky (dari partial) */}
                        <StrukturOrganisasiInfo />
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
