import { InputRupiah } from '@/components/InputRupiah';
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
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Tipe data untuk props settings
interface SettingsProps {
    harga_emas_per_gram: string;
    contact_address: string;
    contact_phone: string;
    contact_email: string;
}

export default function GeneralSettings({
    settings,
}: {
    settings: SettingsProps;
}) {
    const { flash } = usePage().props;

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengaturan' },
        { title: 'Umum' },
    ];

    const { data, setData, patch, errors, processing } = useForm({
        harga_emas_per_gram: settings.harga_emas_per_gram || '',
        contact_address: settings.contact_address || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        harga_emas_per_gram: settings.harga_emas_per_gram || '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success as string);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/settings/general');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Umum" />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    {/* Bagian Header Halaman */}
                    <div>
                        <h1 className="text-xl font-bold">Pengaturan Umum</h1>
                        <p className="text-sm text-muted-foreground">
                            Atur konfigurasi dasar dan informasi kontak untuk
                            aplikasi Anda.
                        </p>
                    </div>

                    {/* Grid Utama 2 Kolom */}
                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        {/* Kolom Kiri: Form Utama */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Formulir Pengaturan</CardTitle>
                                    <CardDescription>
                                        Perubahan yang Anda simpan akan
                                        diterapkan di seluruh website.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="harga_emas_per_gram">
                                            Harga Emas per Gram (Rp)
                                        </Label>
                                        {/* <Input
                                            id="harga_emas_per_gram"
                                            type="number"
                                            value={data.harga_emas_per_gram}
                                            onChange={(e) =>
                                                setData(
                                                    'harga_emas_per_gram',
                                                    e.target.value,
                                                )
                                            }
                                        /> */}
                                        <InputRupiah
                                            id="harga_emas"
                                            value={data.harga_emas_per_gram}
                                            onValueChange={(value) =>
                                                setData(
                                                    'harga_emas_per_gram',
                                                    value,
                                                )
                                            }
                                            placeholder="Contoh: 1200000"
                                        />
                                        {errors.harga_emas_per_gram && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.harga_emas_per_gram}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_address">
                                            Alamat
                                        </Label>
                                        <Input
                                            id="contact_address"
                                            type="text"
                                            value={data.contact_address}
                                            onChange={(e) =>
                                                setData(
                                                    'contact_address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.contact_address && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.contact_address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_phone">
                                            Nomor Telepon
                                        </Label>
                                        <Input
                                            id="contact_phone"
                                            type="text"
                                            value={data.contact_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'contact_phone',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.contact_phone && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.contact_phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_email">
                                            Alamat Email
                                        </Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) =>
                                                setData(
                                                    'contact_email',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.contact_email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.contact_email}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Kolom Kanan: Kartu Informasi */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader className="flex-row items-center gap-2 space-y-0 text-red-600">
                                    <Info className="h-5 w-5" />
                                    <CardTitle>Informasi Pengaturan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                                        <p>
                                            <strong>Harga Emas</strong> adalah
                                            patokan utama untuk menghitung nisab
                                            di <strong>Kalkulator Zakat</strong>
                                            . Perbarui secara berkala agar
                                            perhitungan akurat.
                                        </p>
                                        <p>
                                            <strong>Informasi Kontak</strong>{' '}
                                            akan ditampilkan di halaman publik
                                            seperti "Hubungi Kami", footer, dan
                                            sebagai instruksi pembayaran tunai.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bagian Tombol Aksi di Bawah */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
