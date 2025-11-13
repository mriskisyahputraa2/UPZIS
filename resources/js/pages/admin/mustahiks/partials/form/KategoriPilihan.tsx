import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React from 'react';

/**
 * @summary Properti untuk komponen KategoriPilihan.
 */
interface KategoriPilihanProps {
    /** Nilai kategori pemohon saat ini. */
    value: 'mahasiswa' | 'umum';
    /** Fungsi untuk mengubah nilai kategori pemohon. */
    onValueChange: (value: 'mahasiswa' | 'umum') => void;
    /** Pesan error validasi untuk field kategori. */
    error?: string;
}

/**
 * @summary Kartu komponen untuk memilih kategori mustahik.
 * @description Menyediakan pilihan antara 'Mahasiswa' dan 'Masyarakat Umum (Fakir/Miskin)'
 *              menggunakan radio button.
 * @param {KategoriPilihanProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen kartu pilihan kategori.
 */
export default function KategoriPilihan({
    value,
    onValueChange,
    error,
}: KategoriPilihanProps): JSX.Element {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Kategori Mustahik <span className="text-red-500">*</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={value}
                    onValueChange={(val: 'mahasiswa' | 'umum') =>
                        onValueChange(val)
                    }
                    className="flex flex-col space-y-2 pt-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mahasiswa" id="mahasiswa" />
                        <Label htmlFor="mahasiswa">Mahasiswa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="umum" id="umum" />
                        <Label htmlFor="umum">
                            Masyarakat Umum (Fakir/Miskin)
                        </Label>
                    </div>
                </RadioGroup>
                <InputError message={error} />
            </CardContent>
        </Card>
    );
}
