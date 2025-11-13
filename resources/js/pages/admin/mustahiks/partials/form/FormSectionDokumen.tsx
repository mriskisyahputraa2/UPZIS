import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import FileInput from './FileInput';

/**
 * @summary Properti untuk komponen FormSectionDokumen.
 */
interface FormSectionDokumenProps {
    /** Objek data dari `useForm` Inertia, berisi file. */
    data: {
        file_sktm: File | null;
        file_rumah_depan: File | null;
        file_rumah_belakang: File | null;
        file_rumah_kiri: File | null;
        file_rumah_kanan: File | null;
    };
    /** Objek error dari `useForm` Inertia. */
    errors: Partial<
        Record<
            | 'file_sktm'
            | 'file_rumah_depan'
            | 'file_rumah_belakang'
            | 'file_rumah_kiri'
            | 'file_rumah_kanan',
            string
        >
    >;
    /** Fungsi untuk menangani perubahan file. */
    handleFileChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName:
            | 'file_sktm'
            | 'file_rumah_depan'
            | 'file_rumah_belakang'
            | 'file_rumah_kiri'
            | 'file_rumah_kanan',
    ) => void;
    /** Objek dokumen yang ada (untuk mode edit). */
    dokumen?: Partial<
        Record<
            | 'file_surat_fakir_miskin'
            | 'file_rumah_depan'
            | 'file_rumah_belakang'
            | 'file_rumah_kiri'
            | 'file_rumah_kanan',
            string
        >
    >;
}

/**
 * @summary Komponen seksi form untuk dokumen tambahan (kategori Umum).
 * @description Berisi beberapa input file untuk SKTM dan foto kondisi rumah.
 *              Komponen ini hanya ditampilkan jika kategori mustahik adalah 'umum'.
 * @param {FormSectionDokumenProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen kartu form dokumen tambahan.
 */
export default function FormSectionDokumen({
    data,
    errors,
    handleFileChange,
    dokumen = {},
}: FormSectionDokumenProps): JSX.Element {
    return (
        <Card className="duration-300 animate-in fade-in">
            <CardHeader>
                <CardTitle>Dokumen Tambahan (Umum)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FileInput
                    id="file_sktm"
                    label="Surat Keterangan Miskin"
                    required
                    error={errors.file_sktm}
                    onFileChange={(e) => handleFileChange(e, 'file_sktm')}
                    existingFileUrl={dokumen.file_surat_fakir_miskin}
                    newFile={data.file_sktm}
                />
                <FileInput
                    id="file_rumah_depan"
                    label="Foto Rumah (Depan)"
                    required
                    error={errors.file_rumah_depan}
                    onFileChange={(e) =>
                        handleFileChange(e, 'file_rumah_depan')
                    }
                    existingFileUrl={dokumen.file_rumah_depan}
                    newFile={data.file_rumah_depan}
                />
                <FileInput
                    id="file_rumah_belakang"
                    label="Foto Rumah (Belakang)"
                    required
                    error={errors.file_rumah_belakang}
                    onFileChange={(e) =>
                        handleFileChange(e, 'file_rumah_belakang')
                    }
                    existingFileUrl={dokumen.file_rumah_belakang}
                    newFile={data.file_rumah_belakang}
                />
                <FileInput
                    id="file_rumah_kiri"
                    label="Foto Rumah (Kiri)"
                    required
                    error={errors.file_rumah_kiri}
                    onFileChange={(e) => handleFileChange(e, 'file_rumah_kiri')}
                    existingFileUrl={dokumen.file_rumah_kiri}
                    newFile={data.file_rumah_kiri}
                />
                <FileInput
                    id="file_rumah_kanan"
                    label="Foto Rumah (Kanan)"
                    required
                    error={errors.file_rumah_kanan}
                    onFileChange={(e) =>
                        handleFileChange(e, 'file_rumah_kanan')
                    }
                    existingFileUrl={dokumen.file_rumah_kanan}
                    newFile={data.file_rumah_kanan}
                />
            </CardContent>
        </Card>
    );
}
