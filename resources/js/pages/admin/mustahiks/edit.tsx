import AppLayout from '@/layouts/app-layout';
import { Mustahik, Permohonan } from '@/types';
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
    { title: 'Edit Mustahik' },
];

interface EditProps {
    mustahik: Mustahik & {
        permohonans: (Permohonan & {
            dokumen: any; // Ganti 'any' dengan tipe yang lebih spesifik jika ada
        })[];
    };
}

/**
 * @summary Halaman untuk mengedit data mustahik.
 * @description Halaman ini berisi form yang sudah terisi dengan data mustahik yang ada,
 *              memungkinkan pengguna untuk memperbarui informasi.
 * @param {EditProps} props - Properti yang berisi data mustahik.
 * @returns {JSX.Element} Halaman form edit mustahik.
 */
export default function Edit({ mustahik }: EditProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const latestPermohonan = mustahik.permohonans?.[0] || {};
    const dokumen = latestPermohonan.dokumen || {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: mustahik.name || '',
        jenis_kelamin: mustahik.jenis_kelamin || '',
        kategori_pemohon:
            (latestPermohonan.kategori_pemohon as 'mahasiswa' | 'umum') ||
            'mahasiswa',
        nik: mustahik.nik || '',
        phone_number: mustahik.phone_number || '',
        address: mustahik.address || '',
        kk_number: mustahik.kk_number || '',
        photo: null as File | null,
        pekerjaan: mustahik.pekerjaan || '',
        jumlah_tanggungan: mustahik.jumlah_tanggungan?.toString() || '',
        status_rumah: mustahik.status_rumah || '',
        file_sktm: null as File | null,
        file_rumah_depan: null as File | null,
        file_rumah_belakang: null as File | null,
        file_rumah_kiri: null as File | null,
        file_rumah_kanan: null as File | null,
    });

    // Efek untuk mengatur pratinjau gambar
    useEffect(() => {
        let objectUrl: string | null = null;
        if (data.photo) {
            objectUrl = URL.createObjectURL(data.photo);
            setPreviewImage(objectUrl);
        } else if (mustahik.photo) {
            setPreviewImage(`/storage/${mustahik.photo}`);
        } else {
            setPreviewImage(null);
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [data.photo, mustahik.photo]);

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
        post(`/admin/mustahiks/${mustahik.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <PageHeader
                        title="Edit Mustahik"
                        description={`Memperbarui data untuk "${mustahik.name}"`}
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
                                        dokumen={dokumen}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <FormActions
                        isProcessing={processing}
                        backHref="/admin/mustahiks"
                        saveText="Perbarui Data"
                        processingText="Memperbarui..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}
