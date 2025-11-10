import InputError from '@/components/input-error';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

/**
 * @typedef {object} PersonalDataFormProps
 * @property {object} data - Objek data dari hook useForm.
 * @property {(field: string, value: any) => void} setData - Fungsi untuk mengubah data form.
 * @property {(e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void} handleNumericInput - Fungsi untuk menangani input numerik.
 * @property {object} errors - Objek error dari hook useForm.
 */

/**
 * Komponen untuk langkah kedua formulir: mengisi data diri pemohon.
 * Mencakup nama, nomor HP, jenis kelamin, dan alamat.
 *
 * @param {PersonalDataFormProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const PersonalDataForm = ({ data, setData, handleNumericInput, errors }) => {
    return (
        <Card className="shadow-lg delay-100 duration-500 animate-in fade-in slide-in-from-bottom-5">
            <CardHeader>
                <CardTitle className="flex items-center gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                        2
                    </span>
                    <span className="text-xl">Data Diri Pemohon</span>
                </CardTitle>
                <CardDescription className="pt-1 pl-12">
                    Isi data pribadi Anda sesuai dengan KTP dan Kartu Keluarga.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pl-12">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan Nama Lengkap..."
                            required
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">
                            No. Handphone (WhatsApp)
                        </Label>
                        <Input
                            id="phone_number"
                            value={data.phone_number}
                            onChange={(e) =>
                                handleNumericInput(e, 'phone_number')
                            }
                            placeholder="Masukkan No. Handphone (WhatsApp)..."
                            required
                        />
                        <InputError message={errors.phone_number} />
                    </div>
                    <div className="space-y-2">
                        <Label>Jenis Kelamin *</Label>
                        <RadioGroup
                            value={data.jenis_kelamin}
                            onValueChange={(value) =>
                                setData('jenis_kelamin', value)
                            }
                            className="flex items-center space-x-4 pt-2"
                            required
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="Laki-laki"
                                    id="laki-laki"
                                />
                                <Label htmlFor="laki-laki">Laki-laki</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="Perempuan"
                                    id="perempuan"
                                />
                                <Label htmlFor="perempuan">Perempuan</Label>
                            </div>
                        </RadioGroup>
                        <InputError message={errors.jenis_kelamin} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Masukkan Alamat Lengkap..."
                        required
                    />
                    <InputError message={errors.address} />
                </div>
            </CardContent>
        </Card>
    );
};

export default PersonalDataForm;
