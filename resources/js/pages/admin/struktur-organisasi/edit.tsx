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
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditStrukturOrganisasi({ dataStruktur }) {
    const { flash } = usePage().props;
    const [preview, setPreview] = useState(dataStruktur?.gambar_url || null);

    const { data, setData, post, processing, errors } = useForm({
        gambar: null, // Untuk file baru
        keterangan: dataStruktur?.keterangan || '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success as string);
        }
        if (flash?.error) {
            toast.error(flash.error as string);
        }
    }, [flash]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('gambar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/struktur-organisasi', {
            forceFormData: true, // Penting untuk upload file
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Struktur Organisasi' },
            ]}
        >
            <Head title="Struktur Organisasi" />
            <div className="p-4 sm:p-6 lg:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-3xl space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Struktur Organisasi</CardTitle>
                            <CardDescription>
                                Perbarui gambar dan keterangan struktur
                                organisasi yang akan ditampilkan di halaman
                                publik.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gambar">
                                    Gambar Struktur Organisasi
                                </Label>
                                {preview && (
                                    <div className="mt-2 w-full rounded-md border p-2">
                                        <img
                                            src={preview}
                                            alt="Preview Struktur Organisasi"
                                            className="h-auto w-full rounded"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="gambar"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/jpg"
                                />
                                {errors.gambar && (
                                    <p className="text-sm text-red-600">
                                        {errors.gambar}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keterangan">
                                    Keterangan (Opsional)
                                </Label>
                                <Textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData('keterangan', e.target.value)
                                    }
                                    rows={8}
                                    placeholder="Misal: Ketua: Prof. Dr. John Doe..."
                                />
                                {errors.keterangan && (
                                    <p className="text-sm text-red-600">
                                        {errors.keterangan}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
