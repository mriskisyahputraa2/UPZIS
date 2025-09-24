// resources/js/Pages/Admin/Mustahiks/Edit.jsx

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input as ShadcnInput } from '@/components/ui/input'; // <-- Impor Input asli dengan alias
import { Input } from '@/components/ui/input-with-char-count'; // <-- Impor Input kustom kita
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Tipe data disesuaikan
interface Mustahik {
    id: number;
    name: string;
    nik: string;
    phone_number: string | null;
    address: string | null;
    kk_number: string | null;
    photo: string | null;
}

interface EditMustahikPageProps {
    mustahik: Mustahik;
    flash: {
        success?: string;
    };
    errors: any;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Edit Mustahik' },
];

export default function Edit({
    mustahik,
    flash,
    errors,
}: EditMustahikPageProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        name: mustahik.name || '',
        nik: mustahik.nik || '',
        phone_number: mustahik.phone_number || '',
        address: mustahik.address || '',
        kk_number: mustahik.kk_number || '',
        photo: null as File | null,
        remove_photo: false,
        _method: 'PUT',
    });

    useEffect(() => {
        if (mustahik.photo) {
            setPreviewImage(`/storage/${mustahik.photo}`);
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((data) => ({ ...data, photo: file, remove_photo: false }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData((data) => ({ ...data, photo: null, remove_photo: true }));
        setPreviewImage(null);
    };

    const handleNumericInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: 'nik' | 'kk_number',
    ) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setData(fieldName, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/mustahiks/${mustahik.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Mustahik" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Mustahik</h1>
                        <p className="text-gray-500">
                            Perbarui data untuk &quot;{mustahik.name}&quot;.
                        </p>
                    </div>
                    <Link href="/admin/mustahiks">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Mustahik</CardTitle>
                        <CardDescription>
                            Pastikan data yang Anda masukkan sudah valid.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="photo">Foto Mustahik</Label>
                                <div className="flex items-center gap-4">
                                    {previewImage ? (
                                        <div className="relative">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="h-32 w-32 rounded-lg object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={removeImage}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="photo"
                                            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
                                        >
                                            <Upload className="h-8 w-8 text-gray-400" />
                                            <span className="mt-2 text-sm text-gray-500">
                                                Upload Foto
                                            </span>
                                        </label>
                                    )}
                                    <input
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Format: JPEG, PNG, JPG (Max: 2MB)
                                        </p>
                                        {errors.photo && (
                                            <p className="text-sm text-red-500">
                                                {errors.photo}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Lengkap{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <ShadcnInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Masukkan nama lengkap"
                                        className={
                                            errors.name ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nik">
                                        NIK{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nik"
                                        type="text"
                                        value={data.nik}
                                        onChange={(e) =>
                                            handleNumericInput(e, 'nik')
                                        }
                                        placeholder="Masukkan 16 digit NIK"
                                        maxLength={16}
                                        showCharCount
                                        className={
                                            errors.nik ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.nik && (
                                        <p className="text-sm text-red-500">
                                            {errors.nik}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">
                                        Nomor Telepon
                                    </Label>
                                    <ShadcnInput
                                        id="phone_number"
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                'phone_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nomor telepon"
                                        className={
                                            errors.phone_number
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.phone_number && (
                                        <p className="text-sm text-red-500">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kk_number">
                                        Nomor Kartu Keluarga (KK)
                                    </Label>
                                    <Input
                                        id="kk_number"
                                        type="text"
                                        value={data.kk_number}
                                        onChange={(e) =>
                                            handleNumericInput(e, 'kk_number')
                                        }
                                        placeholder="Masukkan 16 digit nomor KK"
                                        maxLength={16}
                                        showCharCount
                                        className={
                                            errors.kk_number
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.kk_number && (
                                        <p className="text-sm text-red-500">
                                            {errors.kk_number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat Lengkap</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Masukkan alamat lengkap"
                                    rows={4}
                                    className={
                                        errors.address ? 'border-red-500' : ''
                                    }
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Link href="/admin/mustahiks">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Memperbarui...'
                                        : 'Perbarui Data'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
