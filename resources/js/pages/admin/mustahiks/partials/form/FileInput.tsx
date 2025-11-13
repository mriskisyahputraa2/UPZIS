import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

/**
 * @summary Properti untuk komponen FileInput.
 */
interface FileInputProps {
    /** ID unik untuk elemen input. */
    id: string;
    /** Teks label untuk input file. */
    label: string;
    /** Pesan error validasi. */
    error?: string;
    /** Tanda apakah field ini wajib diisi. */
    required?: boolean;
    /** URL file yang sudah ada (untuk mode edit). */
    existingFileUrl?: string | null;
    /** Objek file baru dari state form. */
    newFile: File | null;
    /** Fungsi untuk menangani perubahan file. */
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const isImage = (fileName: string) =>
    fileName && /\.(jpe?g|png|gif|webp)$/i.test(fileName);

/**
 * @summary Komponen input file generik dengan pratinjau.
 * @description Menampilkan input file yang bisa menampilkan pratinjau untuk gambar,
 *              link untuk file non-gambar yang sudah ada, dan nama file untuk file baru yang dipilih.
 * @param {FileInputProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen input file.
 */
export default function FileInput({
    id,
    label,
    error,
    required = false,
    existingFileUrl,
    newFile,
    onFileChange,
}: FileInputProps): JSX.Element {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        if (newFile && newFile.type.startsWith('image/')) {
            objectUrl = URL.createObjectURL(newFile);
            setPreview(objectUrl);
        } else if (newFile) {
            setPreview(null); // Bukan gambar, jangan tampilkan pratinjau gambar
        } else if (existingFileUrl && isImage(existingFileUrl)) {
            setPreview(`/storage/${existingFileUrl}`);
        } else {
            setPreview(null);
        }

        // Cleanup function
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [newFile, existingFileUrl]);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {preview && (
                <div className="relative mt-2 h-32 w-full">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                    />
                </div>
            )}
            {existingFileUrl && !isImage(existingFileUrl) && !newFile && (
                <a
                    href={`/storage/${existingFileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                    <LinkIcon className="h-4 w-4" /> Lihat file saat ini
                </a>
            )}
            <Input id={id} type="file" onChange={onFileChange} />
            {newFile && !newFile.type.startsWith('image/') && (
                <p className="mt-1 text-xs text-muted-foreground">
                    File dipilih: {newFile.name}
                </p>
            )}
            <InputError message={error} />
        </div>
    );
}
