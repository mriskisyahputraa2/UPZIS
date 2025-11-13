import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users } from 'lucide-react';
import React from 'react';

/**
 * @summary Properti untuk komponen FormSectionKependudukan.
 */
interface FormSectionKependudukanProps {
    /** Objek data dari `useForm` Inertia. */
    data: {
        nik: string;
        kk_number: string;
        address: string;
    };
    /** Fungsi `setData` dari `useForm` Inertia. */
    setData: (
        field: 'nik' | 'kk_number' | 'address',
        value: string,
    ) => void;
    /** Objek error dari `useForm` Inertia. */
    errors: Partial<Record<'nik' | 'kk_number' | 'address', string>>;
    /** Fungsi untuk menangani input numerik. */
    handleNumericInput: (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: 'nik' | 'kk_number',
    ) => void;
}

/**
 * @summary Komponen seksi form untuk data kependudukan mustahik.
 * @description Berisi input untuk NIK, Nomor KK, dan Alamat Lengkap.
 * @param {FormSectionKependudukanProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen kartu form data kependudukan.
 */
export default function FormSectionKependudukan({
    data,
    setData,
    errors,
    handleNumericInput,
}: FormSectionKependudukanProps): JSX.Element {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Kependudukan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nik">
                            NIK <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Users className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="nik"
                                type="text"
                                value={data.nik}
                                onChange={(e) => handleNumericInput(e, 'nik')}
                                placeholder="16 digit NIK"
                                maxLength={16}
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.nik} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="kk_number">
                            No. KK <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Users className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="kk_number"
                                type="text"
                                value={data.kk_number}
                                onChange={(e) =>
                                    handleNumericInput(e, 'kk_number')
                                }
                                placeholder="16 digit No. KK"
                                maxLength={16}
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.kk_number} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">
                        Alamat Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Masukkan alamat lengkap sesuai KTP"
                        rows={3}
                    />
                    <InputError message={errors.address} />
                </div>
            </CardContent>
        </Card>
    );
}
