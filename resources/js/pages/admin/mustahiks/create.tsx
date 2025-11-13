import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import FormActions from './partials/form/FormActions';
import FormSectionDokumen from './partials/form/FormSectionDokumen';
import FormSectionEkonomi from './partials/form/FormSectionEkonomi';
import FormSectionKependudukan from './partials/form/FormSectionKependudukan';
import FormSectionPribadi from './partials/form/FormSectionPribadi';
import KategoriPilihan from './partials/form/KategoriPilihan';
import PhotoUploadCard from './partials/form/PhotoUploadCard';
import PageHeader from './partials/PageHeader';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Tambah Mustahik' },
];

/**
 * @summary Halaman untuk membuat data mustahik baru.
 * @description Halaman ini berisi form lengkap untuk menambahkan mustahik,
 *              termasuk data pribadi, kependudukan, dan data kondisional
 *              berdasarkan kategori mustahik yang dipilih.
 * @returns {JSX.Element} Halaman form tambah mustahik.
 */
export default function Create() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        jenis_kelamin: '',
        kategori_pemohon: 'mahasiswa' as 'mahasiswa' | 'umum',
        nik: '',
        phone_number: '',
        address: '',
        kk_number: '',
        photo: null as File | null,
        pekerjaan: '',
        jumlah_tanggungan: '',
        status_rumah: '',
        file_sktm: null as File | null,
        file_rumah_depan: null as File | null,
        file_rumah_belakang: null as File | null,
        file_rumah_kiri: null as File | null,
        file_rumah_kanan: null as File | null,
    });

    // Efek untuk membuat URL pratinjau untuk foto utama
    useEffect(() => {
        let objectUrl: string | null = null;
        if (data.photo) {
            objectUrl = URL.createObjectURL(data.photo);
            setPreviewImage(objectUrl);
        } else {
            setPreviewImage(null);
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [data.photo]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: keyof typeof data,
    ) => {
        const file = e.target.files?.[0];
        setData(fieldName as any, file || null);
    };

    const handleNumericInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: keyof typeof data,
    ) => {
        const value = e.target.value.replace(/\D/g, '');
        setData(fieldName as any, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/mustahiks', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <PageHeader
                        title="Tambah Data Mustahik Baru"
                        description="Isi semua formulir yang diperlukan untuk menambah data."
                        backHref="/admin/mustahiks"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <PhotoUploadCard
                                previewImage={previewImage}
                                error={errors.photo}
                                data={data}
                                setData={setData as any}
                            />
                        </div>

                        <div className="space-y-6 lg:col-span-2">
                            <KategoriPilihan
                                value={data.kategori_pemohon}
                                onValueChange={(value) =>
                                    setData('kategori_pemohon', value)
                                }
                                error={errors.kategori_pemohon}
                            />

                            <FormSectionPribadi
                                data={data}
                                setData={setData as any}
                                errors={errors}
                                handleNumericInput={handleNumericInput as any}
                            />

                            <FormSectionKependudukan
                                data={data}
                                setData={setData as any}
                                errors={errors}
                                handleNumericInput={handleNumericInput as any}
                            />

                            {data.kategori_pemohon === 'umum' && (
                                <>
                                    <FormSectionEkonomi
                                        data={data}
                                        setData={setData as any}
                                        errors={errors}
                                    />
                                    <FormSectionDokumen
                                        data={data}
                                        errors={errors}
                                        handleFileChange={
                                            handleFileChange as any
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <FormActions
                        isProcessing={processing}
                        backHref="/admin/mustahiks"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
