import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileImage, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';

/**
 * @summary Properti untuk komponen PhotoUploadCard.
 */
interface PhotoUploadCardProps {
    /** URL gambar pratinjau yang ada atau yang baru dipilih. */
    previewImage: string | null;
    /** Pesan error validasi untuk field foto. */
    error?: string;
    /** Data form dari `useForm` Inertia. */
    data: { photo: File | null };
    /** Fungsi untuk mengubah data form, dari `useForm` Inertia. */
    setData: (field: 'photo', value: File | null) => void;
}

/**
 * @summary Kartu komponen untuk mengunggah foto mustahik.
 * @description Menyediakan antarmuka untuk mengunggah foto dengan fitur pratinjau,
 *              drag-and-drop, dan menghapus gambar yang telah dipilih.
 * @param {PhotoUploadCardProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen kartu unggah foto.
 */
export default function PhotoUploadCard({
    previewImage,
    error,
    data,
    setData,
}: PhotoUploadCardProps): JSX.Element {
    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setData('photo', file || null);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setData('photo', file);
        }
    };

    const removeImage = () => {
        setData('photo', null);
        const photoInput = document.getElementById('photo') as HTMLInputElement;
        if (photoInput) photoInput.value = '';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Foto Mustahik <span className="text-red-500">*</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {previewImage ? (
                    <div className="relative">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="h-48 w-full rounded-lg object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                            onClick={removeImage}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <label
                        htmlFor="photo"
                        className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                            isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-muted hover:border-primary/50'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-center text-sm text-muted-foreground">
                            <b>Klik untuk upload</b>
                            <br />
                            atau seret file ke sini
                        </span>
                    </label>
                )}
                <Input
                    id="photo"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                />
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <FileImage className="h-4 w-4 flex-shrink-0" />
                    <span>Format: JPG, JPEG, PNG. Ukuran file maksimal 2MB.</span>
                </div>
                <InputError message={error} />
            </CardContent>
        </Card>
    );
}
