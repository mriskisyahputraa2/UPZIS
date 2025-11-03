import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileImage, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Program', href: '/admin/programs' },
    { title: 'Edit Program' },
];

// Helper Functions
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export default function Edit({
    program,
    availablePenyalurans,
    linkedPenyaluranIds,
    periodes,
}) {
    const [previews, setPreviews] = useState<string[]>([]);
    // State baru untuk filter periode
    const [filterPeriode, setFilterPeriode] = useState('all');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: program.name || '',
        description: program.description || '',
        program_date: program.program_date || '',
        status: program.status || 'Draft',
        photos: [] as File[],
        deleted_photos: [] as number[],
        penyaluran_ids: linkedPenyaluranIds || [],
    });

    // ## LOGIKA BARU: Filter daftar penyaluran ##
    const filteredPenyalurans = useMemo(() => {
        if (filterPeriode === 'all') {
            return availablePenyalurans;
        }
        return availablePenyalurans.filter(
            (p) => p.permohonan.periode_id == filterPeriode,
        );
    }, [filterPeriode, availablePenyalurans]);

    // ## LOGIKA BARU: Fungsi untuk memilih semua hasil filter ##
    const handleSelectAllFiltered = () => {
        const filteredIds = filteredPenyalurans.map((p) => p.id);
        const currentIds = new Set(data.penyaluran_ids);
        filteredIds.forEach((id) => currentIds.add(id));
        setData('penyaluran_ids', Array.from(currentIds));
    };

    // ## LOGIKA BARU: Fungsi untuk batal memilih semua hasil filter ##
    const handleDeselectAllFiltered = () => {
        const filteredIds = new Set(filteredPenyalurans.map((p) => p.id));
        setData(
            'penyaluran_ids',
            data.penyaluran_ids.filter((id) => !filteredIds.has(id)),
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('photos', [...data.photos, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        setData(
            'photos',
            data.photos.filter((_, i) => i !== index),
        );
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const removeExistingImage = (photoId: number) => {
        setData('deleted_photos', [...data.deleted_photos, photoId]);
    };

    const handlePenyaluranCheck = (penyaluranId: number) => {
        const currentIds = data.penyaluran_ids;
        if (currentIds.includes(penyaluranId)) {
            setData(
                'penyaluran_ids',
                currentIds.filter((id) => id !== penyaluranId),
            );
        } else {
            setData('penyaluran_ids', [...currentIds, penyaluranId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/programs/${program.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Program: ${program.name}`} />
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
                            <h1 className="text-xl font-bold">Edit Program</h1>
                            <p className="text-sm text-muted-foreground">
                                Memperbarui detail untuk "{program.name}".
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

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Hubungkan Data Penyaluran
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih penyaluran yang termasuk dalam
                                        program ini. Total dana akan dihitung
                                        otomatis.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex flex-col gap-4 rounded-lg border bg-muted/50 p-4 sm:flex-row">
                                        <div className="flex-1 space-y-2">
                                            <Label>
                                                Filter berdasarkan Periode
                                            </Label>
                                            <Select
                                                value={filterPeriode}
                                                onValueChange={setFilterPeriode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih periode..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Tampilkan Semua Periode
                                                    </SelectItem>
                                                    {periodes.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={String(p.id)}
                                                        >
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-shrink-0 items-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={
                                                    handleSelectAllFiltered
                                                }
                                            >
                                                Pilih Semua
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                // variant="destructive-outline"
                                                className="border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-200"
                                                onClick={
                                                    handleDeselectAllFiltered
                                                }
                                            >
                                                Batal Pilih
                                            </Button>
                                        </div>
                                    </div>

                                    <ScrollArea className="h-72 rounded-md border">
                                        <div className="p-4">
                                            {filteredPenyalurans.length > 0 ? (
                                                filteredPenyalurans.map(
                                                    (penyaluran) => (
                                                        <div
                                                            key={penyaluran.id}
                                                            className="flex items-start space-x-3 py-3"
                                                        >
                                                            <Checkbox
                                                                id={`penyaluran-${penyaluran.id}`}
                                                                checked={data.penyaluran_ids.includes(
                                                                    penyaluran.id,
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handlePenyaluranCheck(
                                                                        penyaluran.id,
                                                                    )
                                                                }
                                                            />
                                                            <div className="grid gap-1.5 leading-none">
                                                                <label
                                                                    htmlFor={`penyaluran-${penyaluran.id}`}
                                                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    {formatCurrency(
                                                                        penyaluran.amount,
                                                                    )}{' '}
                                                                    kepada{' '}
                                                                    {
                                                                        penyaluran
                                                                            .permohonan
                                                                            .mustahik
                                                                            .name
                                                                    }
                                                                </label>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatDate(
                                                                        penyaluran.distribution_date,
                                                                    )}{' '}
                                                                    -{' '}
                                                                    <span className="capitalize">
                                                                        {penyaluran.kategori_alokasi.replace(
                                                                            '_',
                                                                            ' ',
                                                                        )}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                <p className="py-10 text-center text-sm text-muted-foreground">
                                                    Tidak ada data penyaluran
                                                    yang cocok dengan filter.
                                                </p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Dokumentasi Foto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="photos">
                                            Tambah Foto Baru
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

                                    {(program.photos.length > 0 ||
                                        previews.length > 0) && <Separator />}

                                    <p className="text-sm font-medium">
                                        Foto Tersimpan (
                                        {
                                            program.photos.filter(
                                                (p) =>
                                                    !data.deleted_photos.includes(
                                                        p.id,
                                                    ),
                                            ).length
                                        }
                                        )
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {program.photos.map(
                                            (photo) =>
                                                !data.deleted_photos.includes(
                                                    photo.id,
                                                ) && (
                                                    <div
                                                        key={photo.id}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={`/storage/${photo.photo_path}`}
                                                            alt="Foto program"
                                                            className="h-24 w-full rounded-md object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                            onClick={() =>
                                                                removeExistingImage(
                                                                    photo.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ),
                                        )}
                                        {previews.map((src, index) => (
                                            <div key={src} className="relative">
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
                                                        removeNewImage(index)
                                                    }
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/programs">
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
