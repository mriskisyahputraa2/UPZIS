import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface CreateMustahikPageProps extends PageProps {}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Tambah Mustahik', href: '/admin/mustahiks/create' },
];

export default function Create({ flash }: CreateMustahikPageProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        nik: '',
        phone_number: '',
        address: '',
        kk_number: '',
        photo: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('photo', null);
        setPreviewImage(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/mustahiks', {
            forceFormData: true, // Penting untuk upload file
        });
    };

    const handleNumericInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string,
    ) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Hanya terima angka
        setData(fieldName, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Mustahik" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Mustahik</h1>
                        <p className="text-gray-500">
                            Tambah data mustahik baru ke dalam sistem.
                        </p>
                    </div>
                    <Link href="/admin/mustahiks">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div
                        className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700"
                        role="alert"
                    >
                        {flash.success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Form Data Mustahik</CardTitle>
                        <CardDescription>
                            Isi form berikut dengan data mustahik yang valid.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Upload Foto */}
                            <div className="space-y-4">
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
                                    <div className="flex-1">
                                        <Input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
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
                                {/* Field lainnya tetap sama */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Lengkap{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
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
                                        className={
                                            errors.nik ? 'border-red-500' : ''
                                        }
                                    />
                                    <p className="text-xs text-gray-500">
                                        {data.nik.length}/16 karakter
                                    </p>
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
                                    <Input
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
                                        className={
                                            errors.kk_number
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className="text-xs text-gray-500">
                                        {data.kk_number.length}/16 karakter
                                    </p>
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
                                        ? 'Menyimpan...'
                                        : 'Simpan Data'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
