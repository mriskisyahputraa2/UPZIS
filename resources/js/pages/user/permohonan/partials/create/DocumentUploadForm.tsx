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
import React from 'react';
import FileInput from '../shared/FileInput';

/**
 * @typedef {object} DocumentUploadFormProps
 * @property {object} data - Objek data dari hook useForm.
 * @property {(field: string, value: any) => void} setData - Fungsi untuk mengubah data form.
 * @property {(e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void} handleNumericInput - Fungsi untuk menangani input numerik.
 * @property {object} errors - Objek error dari hook useForm.
 */

/**
 * Komponen untuk langkah ketiga formulir: data kependudukan dan unggah dokumen.
 * Mencakup NIK, No. KK, dan berbagai file dokumen yang diperlukan.
 *
 * @param {DocumentUploadFormProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const DocumentUploadForm = ({ data, setData, handleNumericInput, errors }) => {
    return (
        <Card className="shadow-lg delay-200 duration-500 animate-in fade-in slide-in-from-bottom-5">
            <CardHeader>
                <CardTitle className="flex items-center gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                        3
                    </span>
                    <span className="text-xl">
                        Data Kependudukan & Dokumen
                    </span>
                </CardTitle>
                <CardDescription className="pt-1 pl-12">
                    Siapkan dokumen Anda dalam format JPG, JPEG, PNG, atau PDF
                    (Maks. 2MB).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pl-12">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nik">
                            Nomor Induk Kependudukan (NIK)
                        </Label>
                        <Input
                            id="nik"
                            value={data.nik}
                            onChange={(e) => handleNumericInput(e, 'nik')}
                            maxLength={16}
                            placeholder="Masukkan NIK..."
                            required
                        />
                        <InputError message={errors.nik} />
                        <p className="text-right text-xs text-muted-foreground">
                            Sisa {16 - data.nik.length} karakter
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="kk_number">
                            Nomor Kartu Keluarga (KK)
                        </Label>
                        <Input
                            id="kk_number"
                            value={data.kk_number}
                            onChange={(e) =>
                                handleNumericInput(e, 'kk_number')
                            }
                            placeholder="Masukkan KK..."
                            maxLength={16}
                            required
                        />
                        <InputError message={errors.kk_number} />
                        <p className="text-right text-xs text-muted-foreground">
                            Sisa {16 - data.kk_number.length} karakter
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <FileInput
                        id="file_ktp"
                        label="Scan/Foto KTP"
                        file={data.file_ktp}
                        onFileChange={(file) => setData('file_ktp', file)}
                        error={errors.file_ktp}
                    />
                    <FileInput
                        id="file_kk"
                        label="Scan/Foto KK"
                        file={data.file_kk}
                        onFileChange={(file) => setData('file_kk', file)}
                        error={errors.file_kk}
                    />
                    <FileInput
                        id="file_khs"
                        label="Scan/Foto KHS"
                        file={data.file_khs}
                        onFileChange={(file) => setData('file_khs', file)}
                        error={errors.file_khs}
                    />
                    <FileInput
                        id="file_surat_fakir_miskin"
                        label="Surat Fakir/Miskin"
                        file={data.file_surat_fakir_miskin}
                        onFileChange={(file) =>
                            setData('file_surat_fakir_miskin', file)
                        }
                        error={errors.file_surat_fakir_miskin}
                    />
                    <FileInput
                        id="file_tidak_menerima_beasiswa"
                        label="Surat Tidak Menerima Beasiswa"
                        file={data.file_tidak_menerima_beasiswa}
                        onFileChange={(file) =>
                            setData('file_tidak_menerima_beasiswa', file)
                        }
                        error={errors.file_tidak_menerima_beasiswa}
                    />
                    <FileInput
                        id="file_surat_permohonan"
                        label="Surat Permohonan"
                        file={data.file_surat_permohonan}
                        onFileChange={(file) =>
                            setData('file_surat_permohonan', file)
                        }
                        error={errors.file_surat_permohonan}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default DocumentUploadForm;
