// resources/js/Pages/Admin/Mustahiks/Edit.jsx (Disesuaikan)

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    FileImage,
    Phone,
    Trash2,
    Upload,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Edit Mustahik' },
];

export default function Edit({ mustahik }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: mustahik.name || '',
        nik: mustahik.nik || '',
        phone_number: mustahik.phone_number || '',
        address: mustahik.address || '',
        kk_number: mustahik.kk_number || '',
        photo: null,
        remove_photo: false, // Flag untuk memberitahu backend jika foto dihapus
        _method: 'PUT', // Metode untuk update
    });

    // Logika khusus untuk Edit: Menampilkan foto yang sudah ada saat halaman dimuat
    useEffect(() => {
        if (mustahik.photo) {
            setPreviewImage(`/storage/${mustahik.photo}`);
        }
    }, [mustahik.photo]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, photo: file, remove_photo: false }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageChange({ target: { files: [file] } });
        }
    };

    // Logika khusus untuk Edit: Menghapus foto yang ada
    const removeImage = () => {
        setData((prev) => ({ ...prev, photo: null, remove_photo: true }));
        setPreviewImage(null);
        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.value = '';
        }
    };

    const handleNumericInput = (e, fieldName) => {
        const value = e.target.value.replace(/\D/g, '');
        setData(fieldName, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/mustahiks/${mustahik.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Mustahik: ${mustahik.name}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/mustahiks">
                            <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Edit Mustahik</h1>
                            <p className="text-sm text-muted-foreground">
                                Memperbarui data untuk "{mustahik.name}"
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        {/* Kolom Kiri: Upload Foto */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Foto Mustahik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="h-48 w-full rounded-lg object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                                                onClick={removeImage}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="photo"
                                            className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                                                isDragging
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-muted hover:border-primary/50'
                                            }`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragging(true);
                                            }}
                                            onDragLeave={() =>
                                                setIsDragging(false)
                                            }
                                            onDrop={handleDrop}
                                        >
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                            <span className="mt-2 text-center text-sm text-muted-foreground">
                                                <b>Ganti foto</b>
                                                <br />
                                                atau seret file ke sini
                                            </span>
                                        </label>
                                    )}
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <FileImage className="h-4 w-4 flex-shrink-0" />
                                        <span>
                                            Format: JPG, JPEG, PNG. Ukuran file
                                            maksimal 2MB.
                                        </span>
                                    </div>
                                    <InputError message={errors.photo} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Kolom Kanan: Form Isian */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Card Informasi Pribadi */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Pribadi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Lengkap *
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Contoh: Muhammad Al-Fatih"
                                            error={errors.name}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">
                                            Nomor Telepon
                                        </Label>
                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="phone_number"
                                                type="tel"
                                                value={data.phone_number}
                                                onChange={(e) =>
                                                    handleNumericInput(
                                                        e,
                                                        'phone_number',
                                                    )
                                                }
                                                placeholder="Contoh: 081234567890"
                                                className="pl-10"
                                                error={errors.phone_number}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.phone_number}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card Data Kependudukan */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Kependudukan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nik">
                                                Nomor Induk Kependudukan (NIK)
                                            </Label>
                                            <div className="relative">
                                                <Users className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="nik"
                                                    type="text"
                                                    value={data.nik}
                                                    onChange={(e) =>
                                                        handleNumericInput(
                                                            e,
                                                            'nik',
                                                        )
                                                    }
                                                    placeholder="16 digit NIK"
                                                    maxLength={16}
                                                    className="pl-10"
                                                    error={errors.nik}
                                                />
                                            </div>
                                            <p className="text-right text-xs text-muted-foreground">
                                                Sisa {16 - data.nik.length}{' '}
                                                karakter
                                            </p>
                                            <InputError message={errors.nik} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kk_number">
                                                No. Kartu Keluarga (KK)
                                            </Label>
                                            <div className="relative">
                                                <Users className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="kk_number"
                                                    type="text"
                                                    value={data.kk_number}
                                                    onChange={(e) =>
                                                        handleNumericInput(
                                                            e,
                                                            'kk_number',
                                                        )
                                                    }
                                                    placeholder="16 digit No. KK"
                                                    maxLength={16}
                                                    className="pl-10"
                                                    error={errors.kk_number}
                                                />
                                            </div>
                                            <p className="text-right text-xs text-muted-foreground">
                                                Sisa{' '}
                                                {16 - data.kk_number.length}{' '}
                                                karakter
                                            </p>
                                            <InputError
                                                message={errors.kk_number}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">
                                            Alamat Lengkap
                                        </Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan alamat lengkap sesuai KTP"
                                            rows={3}
                                            error={errors.address}
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/mustahiks">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Memperbarui...' : 'Perbarui Data'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
