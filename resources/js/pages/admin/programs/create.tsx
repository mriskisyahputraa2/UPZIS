import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { ArrowLeft, FileImage, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Program', href: '/admin/programs' },
    { title: 'Tambah Program' },
];

export default function Create() {
    const [previews, setPreviews] = useState<string[]>([]);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        program_date: new Date().toISOString().slice(0, 10),
        status: 'Draft',
        photos: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentPhotos = data.photos as File[];
        setData('photos', [...currentPhotos, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const currentPhotos = data.photos as File[];
        setData(
            'photos',
            currentPhotos.filter((_, i) => i !== index),
        );
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/programs', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Program Baru" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/programs">
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
                                Buat Program Baru
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Lengkapi detail dan dokumentasi untuk program
                                penyaluran.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detail Program</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Program *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            rows={5}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="program_date">
                                                Tanggal Pelaksanaan *
                                            </Label>
                                            <Input
                                                id="program_date"
                                                type="date"
                                                value={data.program_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'program_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.program_date && (
                                                <p className="text-sm text-red-600">
                                                    {errors.program_date}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">
                                                Status Publikasi *
                                            </Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value) =>
                                                    setData('status', value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Draft">
                                                        Draft (Disembunyikan)
                                                    </SelectItem>
                                                    <SelectItem value="Published">
                                                        Published (Tampilkan)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dokumentasi Foto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="photos">
                                            Upload Foto
                                        </Label>
                                        <Input
                                            id="photos"
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            accept="image/png, image/jpeg, image/jpg"
                                        />
                                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                            <FileImage className="h-4 w-4 flex-shrink-0" />
                                            <span>
                                                Format: JPG, JPEG, PNG. Maks 2MB
                                                per file.
                                            </span>
                                        </div>
                                        {errors.photos && (
                                            <p className="text-sm text-red-600">
                                                {errors.photos}
                                            </p>
                                        )}
                                    </div>
                                    {previews.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {previews.map((src, index) => (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`Preview ${index}`}
                                                        className="h-24 w-full rounded-md object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* ## PERUBAHAN UTAMA DI SINI ## */}
                    <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end sm:gap-4">
                        <Link
                            href="/admin/programs"
                            className="w-full sm:w-auto"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                            >
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan & Lanjutkan Penyaluran'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
