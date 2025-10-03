import InputError from '@/components/input-error';
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
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    File,
    FileUp,
    Trash2,
    Upload,
    User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';

// Komponen File Input Kustom
const FileInput = ({ id, label, file, onFileChange, error }) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleFileChange = (e) => onFileChange(e.target.files[0]);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="truncate font-semibold">
                {label} <span className="text-red-500">*</span>
            </Label>
            {file ? (
                <div className="flex items-center justify-between rounded-lg border bg-green-50 p-3 dark:bg-green-900/20">
                    <div className="flex min-w-0 items-center gap-3">
                        <File className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="truncate text-sm font-medium text-green-800 dark:text-green-300">
                            {file.name}
                        </span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 text-red-500 hover:bg-red-100"
                        onClick={() => onFileChange(null)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                        isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-muted-foreground">
                        Seret file atau klik
                    </span>
                </label>
            )}
            <Input
                id={id}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                required
            />
            <InputError message={error} />
        </div>
    );
};

export default function Create({ activePeriode }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nik: '',
        kk_number: '',
        phone_number: '',
        address: '',
        photo: null,
        file_ktp: null,
        file_kk: null,
        file_khs: null,
        file_surat_fakir_miskin: null,
        file_tidak_menerima_beasiswa: null,
        file_surat_permohonan: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/ajukan-bantuan');
    };

    const handleNumericInput = (e, fieldName) => {
        const value = e.target.value.replace(/\D/g, '');
        setData(fieldName, value);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData('photo', file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const [previewImage, setPreviewImage] = useState(null);

    return (
        <PublicLayout>
            <Head title="Ajukan Bantuan" />

            <section className="bg-green-700 pt-32 pb-16 text-white">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Formulir Pengajuan Bantuan
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Ikuti 4 langkah mudah untuk menyelesaikan pendaftaran
                        Anda.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-4xl px-4">
                    {activePeriode ? (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8"
                            noValidate
                        >
                            <Card className="shadow-lg duration-500 animate-in fade-in slide-in-from-bottom-5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                                            1
                                        </span>
                                        <span className="text-xl">
                                            Unggah Foto Profil
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="pt-1 pl-12">
                                        Unggah foto formal atau semi-formal Anda
                                        (wajah terlihat jelas).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-4 pl-12">
                                    <label
                                        htmlFor="photo"
                                        className="group relative h-48 w-48 cursor-pointer"
                                    >
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="h-full w-full rounded-full object-cover shadow-md transition-opacity group-hover:opacity-50"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed bg-gray-50 transition-colors group-hover:border-primary">
                                                <UserIcon className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <FileUp className="h-8 w-8 text-white" />
                                        </div>
                                    </label>
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                        required
                                    />
                                    <InputError message={errors.photo} />
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg delay-100 duration-500 animate-in fade-in slide-in-from-bottom-5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                                            2
                                        </span>
                                        <span className="text-xl">
                                            Data Diri Pemohon
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="pt-1 pl-12">
                                        Isi data pribadi Anda sesuai dengan KTP
                                        dan Kartu Keluarga.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pl-12">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan Nama Lengkap..."
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">
                                                No. Handphone (WhatsApp)
                                            </Label>
                                            <Input
                                                id="phone_number"
                                                value={data.phone_number}
                                                onChange={(e) =>
                                                    handleNumericInput(
                                                        e,
                                                        'phone_number',
                                                    )
                                                }
                                                placeholder="Masukkan No. Handphone (WhatsApp)..."
                                                required
                                            />
                                            <InputError
                                                message={errors.phone_number}
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
                                            placeholder="Masukkan Alamat Lengkap..."
                                            required
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg delay-200 duration-500 animate-in fade-in slide-in-from-bottom-5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                                            3
                                        </span>
                                        <span className="text-xl">
                                            Data Kependudukan & Dokumen
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="pt-1 pl-12">
                                        Siapkan dokumen Anda dalam format JPG,
                                        JPEG, PNG, atau PDF (Maks. 2MB).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pl-12">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nik">
                                                Nomor Induk Kependudukan (NIK)
                                            </Label>
                                            <Input
                                                id="nik"
                                                value={data.nik}
                                                onChange={(e) =>
                                                    handleNumericInput(e, 'nik')
                                                }
                                                maxLength={16}
                                                placeholder="Masukkan NIK..."
                                                required
                                            />
                                            <InputError message={errors.nik} />
                                            <p className="text-right text-xs text-muted-foreground">
                                                Sisa {16 - data.nik.length}{' '}
                                                karakter
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kk_number">
                                                Nomor Kartu Keluarga (KK)
                                            </Label>
                                            <Input
                                                id="kk_number"
                                                value={data.kk_number}
                                                onChange={(e) =>
                                                    handleNumericInput(
                                                        e,
                                                        'kk_number',
                                                    )
                                                }
                                                placeholder="Masukkan KK..."
                                                maxLength={16}
                                                required
                                            />
                                            <InputError
                                                message={errors.kk_number}
                                            />
                                            <p className="text-right text-xs text-muted-foreground">
                                                Sisa{' '}
                                                {16 - data.kk_number.length}{' '}
                                                karakter
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                        <FileInput
                                            id="file_ktp"
                                            label="Scan/Foto KTP"
                                            file={data.file_ktp}
                                            onFileChange={(file) =>
                                                setData('file_ktp', file)
                                            }
                                            error={errors.file_ktp}
                                        />
                                        <FileInput
                                            id="file_kk"
                                            label="Scan/Foto KK"
                                            file={data.file_kk}
                                            onFileChange={(file) =>
                                                setData('file_kk', file)
                                            }
                                            error={errors.file_kk}
                                        />
                                        <FileInput
                                            id="file_khs"
                                            label="Scan/Foto KHS"
                                            file={data.file_khs}
                                            onFileChange={(file) =>
                                                setData('file_khs', file)
                                            }
                                            error={errors.file_khs}
                                        />
                                        <FileInput
                                            id="file_surat_fakir_miskin"
                                            label="Surat Fakir/Miskin"
                                            file={data.file_surat_fakir_miskin}
                                            onFileChange={(file) =>
                                                setData(
                                                    'file_surat_fakir_miskin',
                                                    file,
                                                )
                                            }
                                            error={
                                                errors.file_surat_fakir_miskin
                                            }
                                        />
                                        <FileInput
                                            id="file_tidak_menerima_beasiswa"
                                            label="Surat Tidak Menerima Beasiswa"
                                            file={
                                                data.file_tidak_menerima_beasiswa
                                            }
                                            onFileChange={(file) =>
                                                setData(
                                                    'file_tidak_menerima_beasiswa',
                                                    file,
                                                )
                                            }
                                            error={
                                                errors.file_tidak_menerima_beasiswa
                                            }
                                        />
                                        <FileInput
                                            id="file_surat_permohonan"
                                            label="Surat Permohonan"
                                            file={data.file_surat_permohonan}
                                            onFileChange={(file) =>
                                                setData(
                                                    'file_surat_permohonan',
                                                    file,
                                                )
                                            }
                                            error={errors.file_surat_permohonan}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg delay-300 duration-500 animate-in fade-in slide-in-from-bottom-5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                                            4
                                        </span>
                                        <span className="text-xl">
                                            Konfirmasi & Kirim
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="pt-1 pl-12">
                                        Periksa kembali data Anda. Pastikan
                                        semua informasi dan dokumen sudah benar
                                        sebelum mengirim.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pl-12">
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="text-base font-bold"
                                        >
                                            <Check className="mr-2 h-5 w-5" />
                                            {processing
                                                ? 'Mengirim Data...'
                                                : 'Saya Setuju & Kirim Pengajuan'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    ) : (
                        <Card className="shadow-lg duration-500 animate-in fade-in">
                            <CardContent className="flex flex-col items-center p-10 text-center">
                                <AlertTriangle className="h-20 w-20 text-yellow-500" />
                                <h2 className="mt-6 text-3xl font-bold">
                                    Pendaftaran Saat Ini Ditutup
                                </h2>
                                <p className="mt-3 text-lg text-muted-foreground">
                                    Mohon maaf, periode pendaftaran bantuan
                                    belum dibuka. Pantau terus informasi dari
                                    kami untuk jadwal pendaftaran berikutnya.
                                </p>
                                <Link href="/">
                                    <Button
                                        className="mt-8 text-base font-bold"
                                        size="lg"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Beranda
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
