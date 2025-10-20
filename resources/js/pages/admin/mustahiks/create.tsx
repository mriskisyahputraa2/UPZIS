import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Tambah Mustahik' },
];

export default function Create() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        jenis_kelamin: '',
        kategori_pemohon: 'mahasiswa', // Default ke mahasiswa
        nik: '',
        phone_number: '',
        address: '',
        kk_number: '',
        photo: null,
        // Data ekonomi & dokumen baru
        pekerjaan: '',
        jumlah_tanggungan: '',
        status_rumah: '',
        file_sktm: null,
        file_rumah_depan: null,
        file_rumah_belakang: null,
        file_rumah_kiri: null,
        file_rumah_kanan: null,
    });

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string = 'photo',
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setData(fieldName as any, file);
            if (fieldName === 'photo') {
                setPreviewImage(URL.createObjectURL(file));
            }
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setData('photo', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('photo', null);
        setPreviewImage(null);
        const photoInput = document.getElementById('photo') as HTMLInputElement;
        if (photoInput) photoInput.value = '';
    };

    const handleNumericInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string,
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
            <Head title="Tambah Mustahik" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/mustahiks">
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
                                Tambah Data Mustahik Baru
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Isi semua formulir yang diperlukan untuk
                                menambah data.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Foto Mustahik *</CardTitle>
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
                                                <b>Klik untuk upload</b>
                                                <br />
                                                atau seret file ke sini
                                            </span>
                                        </label>
                                    )}
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) =>
                                            handleImageChange(e, 'photo')
                                        }
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

                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kategori Mustahik *</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={data.kategori_pemohon}
                                        onValueChange={(value) =>
                                            setData('kategori_pemohon', value)
                                        }
                                        className="flex flex-col space-y-2 pt-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="mahasiswa"
                                                id="mahasiswa"
                                            />
                                            <Label htmlFor="mahasiswa">
                                                Mahasiswa
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="umum"
                                                id="umum"
                                            />
                                            <Label htmlFor="umum">
                                                Masyarakat Umum (Fakir/Miskin)
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    <InputError
                                        message={errors.kategori_pemohon}
                                    />
                                </CardContent>
                            </Card>

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
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Jenis Kelamin *</Label>
                                        <RadioGroup
                                            value={data.jenis_kelamin}
                                            onValueChange={(value) =>
                                                setData('jenis_kelamin', value)
                                            }
                                            className="flex items-center space-x-4 pt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="Laki-laki"
                                                    id="laki-laki"
                                                />
                                                <Label htmlFor="laki-laki">
                                                    Laki-laki
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="Perempuan"
                                                    id="perempuan"
                                                />
                                                <Label htmlFor="perempuan">
                                                    Perempuan
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                        <InputError
                                            message={errors.jenis_kelamin}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">
                                            Nomor Telepon *
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
                                            />
                                        </div>
                                        <InputError
                                            message={errors.phone_number}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Kependudukan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nik">NIK *</Label>
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
                                                />
                                            </div>
                                            <InputError message={errors.nik} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kk_number">
                                                No. KK *
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
                                                />
                                            </div>
                                            <InputError
                                                message={errors.kk_number}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">
                                            Alamat Lengkap *
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
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </CardContent>
                            </Card>

                            {data.kategori_pemohon === 'umum' && (
                                <>
                                    <Card className="duration-300 animate-in fade-in">
                                        <CardHeader>
                                            <CardTitle>
                                                Data Ekonomi & Kondisi (Umum)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="pekerjaan">
                                                    Pekerjaan *
                                                </Label>
                                                <Input
                                                    id="pekerjaan"
                                                    value={data.pekerjaan}
                                                    onChange={(e) =>
                                                        setData(
                                                            'pekerjaan',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.pekerjaan}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="jumlah_tanggungan">
                                                    Jumlah Tanggungan *
                                                </Label>
                                                <Input
                                                    id="jumlah_tanggungan"
                                                    type="number"
                                                    value={
                                                        data.jumlah_tanggungan
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'jumlah_tanggungan',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.jumlah_tanggungan
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label htmlFor="status_rumah">
                                                    Status Kepemilikan Rumah *
                                                </Label>
                                                <Select
                                                    value={data.status_rumah}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'status_rumah',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih status..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Milik Sendiri">
                                                            Milik Sendiri
                                                        </SelectItem>
                                                        <SelectItem value="Sewa/Kontrak">
                                                            Sewa/Kontrak
                                                        </SelectItem>
                                                        <SelectItem value="Menumpang">
                                                            Menumpang
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={
                                                        errors.status_rumah
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="duration-300 animate-in fade-in">
                                        <CardHeader>
                                            <CardTitle>
                                                Dokumen Tambahan (Umum)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="file_sktm">
                                                    SKTM *
                                                </Label>
                                                <Input
                                                    id="file_sktm"
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            e,
                                                            'file_sktm',
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.file_sktm}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="file_rumah_depan">
                                                    Foto Rumah (Depan) *
                                                </Label>
                                                <Input
                                                    id="file_rumah_depan"
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            e,
                                                            'file_rumah_depan',
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.file_rumah_depan
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="file_rumah_belakang">
                                                    Foto Rumah (Belakang) *
                                                </Label>
                                                <Input
                                                    id="file_rumah_belakang"
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            e,
                                                            'file_rumah_belakang',
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.file_rumah_belakang
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="file_rumah_kiri">
                                                    Foto Rumah (Kiri) *
                                                </Label>
                                                <Input
                                                    id="file_rumah_kiri"
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            e,
                                                            'file_rumah_kiri',
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.file_rumah_kiri
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="file_rumah_kanan">
                                                    Foto Rumah (Kanan) *
                                                </Label>
                                                <Input
                                                    id="file_rumah_kanan"
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            e,
                                                            'file_rumah_kanan',
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.file_rumah_kanan
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/mustahiks">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
