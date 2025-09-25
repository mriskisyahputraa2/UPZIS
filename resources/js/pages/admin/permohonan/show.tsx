// resources/js/Pages/Admin/Permohonan/Show.jsx

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { ArrowLeft, Download } from 'lucide-react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan', href: '/admin/permohonan' },
    { title: 'Detail Permohonan' },
];

export default function Show({ permohonan }) {
    const { data, setData, put, processing, errors } = useForm({
        status: permohonan.status,
        notes_admin: permohonan.notes_admin || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.permohonan.update', permohonan.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Permohonan - ${permohonan.mustahik.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Detail Permohonan
                        </h1>
                        <p className="text-gray-500">
                            Verifikasi data untuk {permohonan.mustahik.name}
                        </p>
                    </div>
                    <Link href="/admin/permohonan">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Kolom Kiri: Detail Data Mustahik */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Pemohon</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nama Lengkap</Label>
                                        <p>{permohonan.mustahik.name}</p>
                                    </div>
                                    <div>
                                        <Label>NIK</Label>
                                        <p>{permohonan.mustahik.nik}</p>
                                    </div>
                                    <div>
                                        <Label>No. KK</Label>
                                        <p>
                                            {permohonan.mustahik.kk_number ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label>No. Telepon</Label>
                                        <p>
                                            {permohonan.mustahik.phone_number ||
                                                '-'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Alamat</Label>
                                    <p>{permohonan.mustahik.address || '-'}</p>
                                </div>
                                <hr />
                                <div>
                                    <Label>Periode Pengajuan</Label>
                                    <p className="font-semibold">
                                        {permohonan.periode.name}
                                    </p>
                                </div>

                                <Label>Dokumen Terlampir</Label>
                                <div className="flex space-x-2">
                                    {permohonan.file_ktp && (
                                        <Button
                                            asChild
                                            variant="secondary"
                                            size="sm"
                                        >
                                            <a
                                                href={`/storage/${permohonan.file_ktp}`}
                                                target="_blank"
                                            >
                                                <Download className="mr-2 h-4 w-4" />{' '}
                                                KTP
                                            </a>
                                        </Button>
                                    )}
                                    {permohonan.file_kk && (
                                        <Button
                                            asChild
                                            variant="secondary"
                                            size="sm"
                                        >
                                            <a
                                                href={`/storage/${permohonan.file_kk}`}
                                                target="_blank"
                                            >
                                                <Download className="mr-2 h-4 w-4" />{' '}
                                                KK
                                            </a>
                                        </Button>
                                    )}
                                    {permohonan.file_khs && (
                                        <Button
                                            asChild
                                            variant="secondary"
                                            size="sm"
                                        >
                                            <a
                                                href={`/storage/${permohonan.file_khs}`}
                                                target="_blank"
                                            >
                                                <Download className="mr-2 h-4 w-4" />{' '}
                                                KHS
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Aksi Verifikasi */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Verifikasi Permohonan</CardTitle>
                                    <CardDescription>
                                        Ubah status dan berikan catatan jika
                                        perlu.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">
                                            Status Permohonan
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData('status', value)
                                            }
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Baru">
                                                    Baru
                                                </SelectItem>
                                                <SelectItem value="Diverifikasi">
                                                    Diverifikasi
                                                </SelectItem>
                                                <SelectItem value="Disetujui">
                                                    Disetujui
                                                </SelectItem>
                                                <SelectItem value="Ditolak">
                                                    Ditolak
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="notes_admin">
                                            Catatan Admin (Internal)
                                        </Label>
                                        <Textarea
                                            id="notes_admin"
                                            value={data.notes_admin}
                                            onChange={(e) =>
                                                setData(
                                                    'notes_admin',
                                                    e.target.value,
                                                )
                                            }
                                            rows={5}
                                            placeholder="Tulis hasil verifikasi atau alasan perubahan status di sini..."
                                        />
                                        {errors.notes_admin && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.notes_admin}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
