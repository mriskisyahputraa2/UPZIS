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

// Pastikan Anda mengimpor React jika file Anda .tsx
// import React from 'react';

// Jika Anda menggunakan TypeScript (.tsx), Anda bisa menambahkan interface untuk props
// interface StrukturOrganisasiFormProps {
//     data: { keterangan: string };
//     setData: (field: string, value: any) => void;
//     errors: { gambar?: string; keterangan?: string };
//     preview: string | null;
//     handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

export default function StrukturOrganisasiForm({
    data,
    setData,
    errors,
    preview,
    handleFileChange,
}) {
    return (
        <div className="space-y-8 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Data Utama</CardTitle>
                    <CardDescription>
                        Gambar dan keterangan ini akan ditampilkan di halaman
                        publik.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
        </div>
    );
}
