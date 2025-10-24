import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
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
import { format } from 'date-fns';
import { ArrowLeft, Info } from 'lucide-react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Periode', href: '/admin/periode' },
    { title: 'Tambah Periode' },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        start_date: null,
        end_date: null,
        status: 'Tidak Aktif',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/periode', { onSuccess: () => reset() });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Periode" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/periode">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="flex-shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">
                                    Tambah Periode Baru
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Buat siklus pendaftaran baru untuk
                                    penyaluran bantuan.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="order-last lg:order-first lg:col-span-2">
                            {/* Kolom Kiri: Form Isian Utama */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Detail Periode</CardTitle>
                                        <CardDescription>
                                            Isi semua informasi yang diperlukan
                                            untuk periode baru.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Periode *
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
                                                placeholder="Contoh: Bantuan Pendidikan Semester Ganjil 2025"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Deskripsi (Opsional)
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
                                                placeholder="Jelaskan singkat mengenai tujuan dan sasaran periode ini"
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="start_date">
                                                    Tanggal Mulai *
                                                </Label>
                                                <DatePicker
                                                    date={
                                                        data.start_date
                                                            ? new Date(
                                                                  data.start_date.replace(
                                                                      /-/g,
                                                                      '/',
                                                                  ),
                                                              )
                                                            : null
                                                    }
                                                    setDate={(date) =>
                                                        setData(
                                                            'start_date',
                                                            date
                                                                ? format(
                                                                      date,
                                                                      'yyyy-MM-dd',
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.start_date}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end_date">
                                                    Tanggal Selesai *
                                                </Label>
                                                <DatePicker
                                                    date={
                                                        data.end_date
                                                            ? new Date(
                                                                  data.end_date.replace(
                                                                      /-/g,
                                                                      '/',
                                                                  ),
                                                              )
                                                            : null
                                                    }
                                                    setDate={(date) =>
                                                        setData(
                                                            'end_date',
                                                            date
                                                                ? format(
                                                                      date,
                                                                      'yyyy-MM-dd',
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.end_date}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">
                                                Status *
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData('status', value)
                                                }
                                                value={data.status}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Aktif">
                                                        Aktif
                                                    </SelectItem>
                                                    <SelectItem value="Tidak Aktif">
                                                        Tidak Aktif
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.status}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Kolom Kanan: Kartu Informasi */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader className="flex-row items-center gap-2 space-y-0 text-red-500">
                                    <Info className="h-5 w-5" />
                                    <CardTitle>Informasi Penting</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* ## PERUBAHAN: Format dan redaksi teks diperbarui ## */}
                                    <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                                        <p>
                                            Pastikan{' '}
                                            <strong>Tanggal Mulai</strong> harus
                                            lebih besar dari{' '}
                                            <strong>Tanggal Selesai.</strong>.
                                        </p>
                                        <p>
                                            Sistem hanya mengizinkan{' '}
                                            <strong>satu periode</strong> untuk
                                            berstatus <strong>"Aktif"</strong>{' '}
                                            dalam satu periode.
                                        </p>
                                        <p>
                                            Mengubah status periode menjadi{' '}
                                            <strong>"Aktif"</strong> akan secara
                                            otomatis{' '}
                                            <strong>menonaktifkan</strong>{' '}
                                            periode lain yang sedang aktif.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/periode">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Periode'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
