import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Phone } from 'lucide-react';
import React from 'react';

/**
 * @summary Properti untuk komponen FormSectionPribadi.
 */
interface FormSectionPribadiProps {
    /** Objek data dari `useForm` Inertia. */
    data: {
        name: string;
        jenis_kelamin: string;
        phone_number: string;
    };
    /** Fungsi `setData` dari `useForm` Inertia. */
    setData: (
        field: 'name' | 'jenis_kelamin' | 'phone_number',
        value: string,
    ) => void;
    /** Objek error dari `useForm` Inertia. */
    errors: Partial<Record<'name' | 'jenis_kelamin' | 'phone_number', string>>;
    /** Fungsi untuk menangani input numerik. */
    handleNumericInput: (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: 'phone_number',
    ) => void;
}

/**
 * @summary Komponen seksi form untuk informasi pribadi mustahik.
 * @description Berisi input untuk Nama Lengkap, Jenis Kelamin, dan Nomor Telepon.
 * @param {FormSectionPribadiProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen kartu form informasi pribadi.
 */
export default function FormSectionPribadi({
    data,
    setData,
    errors,
    handleNumericInput,
}: FormSectionPribadiProps): JSX.Element {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Muhammad Al-Fatih"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label>
                        Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                        value={data.jenis_kelamin}
                        onValueChange={(value) =>
                            setData('jenis_kelamin', value)
                        }
                        className="flex items-center space-x-4 pt-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Laki-laki" id="laki-laki" />
                            <Label htmlFor="laki-laki">Laki-laki</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Perempuan" id="perempuan" />
                            <Label htmlFor="perempuan">Perempuan</Label>
                        </div>
                    </RadioGroup>
                    <InputError message={errors.jenis_kelamin} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">
                        Nomor Telepon <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="phone_number"
                            type="tel"
                            value={data.phone_number}
                            onChange={(e) =>
                                handleNumericInput(e, 'phone_number')
                            }
                            placeholder="Contoh: 081234567890"
                            className="pl-10"
                        />
                    </div>
                    <InputError message={errors.phone_number} />
                </div>
            </CardContent>
        </Card>
    );
}
