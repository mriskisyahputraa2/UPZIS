import InputError from '@/components/input-error';
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
import React from 'react';

/**
 * @summary Properti untuk komponen FormSectionEkonomi.
 */
interface FormSectionEkonomiProps {
    /** Objek data dari `useForm` Inertia. */
    data: {
        pekerjaan: string;
        jumlah_tanggungan: string;
        status_rumah: string;
    };
    /** Fungsi `setData` dari `useForm` Inertia. */
    setData: (
        field: 'pekerjaan' | 'jumlah_tanggungan' | 'status_rumah',
        value: string,
    ) => void;
    /** Objek error dari `useForm` Inertia. */
    errors: Partial<
        Record<'pekerjaan' | 'jumlah_tanggungan' | 'status_rumah', string>
    >;
}

/**
 * @summary Komponen seksi form untuk data ekonomi & kondisi mustahik (kategori Umum).
 * @description Berisi input untuk Pekerjaan, Jumlah Tanggungan, dan Status Kepemilikan Rumah.
 *              Komponen ini hanya ditampilkan jika kategori mustahik adalah 'umum'.
 * @param {FormSectionEkonomiProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen kartu form data ekonomi.
 */
export default function FormSectionEkonomi({
    data,
    setData,
    errors,
}: FormSectionEkonomiProps): JSX.Element {
    return (
        <Card className="duration-300 animate-in fade-in">
            <CardHeader>
                <CardTitle>Data Ekonomi & Kondisi (Umum)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="pekerjaan">
                        Pekerjaan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="pekerjaan"
                        value={data.pekerjaan}
                        onChange={(e) => setData('pekerjaan', e.target.value)}
                    />
                    <InputError message={errors.pekerjaan} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jumlah_tanggungan">
                        Jumlah Tanggungan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="jumlah_tanggungan"
                        type="number"
                        value={data.jumlah_tanggungan}
                        onChange={(e) =>
                            setData('jumlah_tanggungan', e.target.value)
                        }
                    />
                    <InputError message={errors.jumlah_tanggungan} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="status_rumah">
                        Status Kepemilikan Rumah{' '}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.status_rumah}
                        onValueChange={(value) =>
                            setData('status_rumah', value)
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
                            <SelectItem value="Menumpang">Menumpang</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status_rumah} />
                </div>
            </CardContent>
        </Card>
    );
}
