import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ProgramForm, ProgramPhoto } from '@/types/program';
import { FileImage, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '@/components/input-error';

/**
 * @interface PhotoManagerProps
 * @description Properti untuk komponen PhotoManager.
 * @property {ProgramPhoto[]} [existingPhotos=[]] - Foto yang sudah ada dari database.
 * @property {Function} setData - Fungsi `setData` dari `useForm` untuk memperbarui state form.
 * @property {object} errors - Objek error validasi dari Inertia.
 */
interface PhotoManagerProps {
    existingPhotos?: ProgramPhoto[];
    setData: (
        field: keyof ProgramForm,
        value: File[] | number[],
    ) => void;
    errors: any;
}

/**
 * @name PhotoManager
 * @description Komponen untuk mengelola unggahan, pratinjau, dan penghapusan foto program.
 * @param {PhotoManagerProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const PhotoManager = ({
    existingPhotos = [],
    setData,
    errors,
}: PhotoManagerProps) => {
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [deletedPhotos, setDeletedPhotos] = useState<number[]>([]);

    useEffect(() => {
        setData('photos', newPhotos);
    }, [newPhotos]);

    useEffect(() => {
        setData('deleted_photos', deletedPhotos);
    }, [deletedPhotos]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setNewPhotos((prev) => [...prev, ...files]);

        const newFilePreviews = files.map((file) => URL.createObjectURL(file));
        setNewPreviews((prev) => [...prev, ...newFilePreviews]);
    };

    const removeNewImage = (index: number) => {
        setNewPhotos(newPhotos.filter((_, i) => i !== index));
        setNewPreviews(newPreviews.filter((_, i) => i !== index));
    };

    const removeExistingImage = (photoId: number) => {
        setDeletedPhotos([...deletedPhotos, photoId]);
    };

    const visibleExistingPhotos = existingPhotos.filter(
        (p) => !deletedPhotos.includes(p.id),
    );

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Dokumentasi Foto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="photos">Upload Foto Baru</Label>
                    <Input
                        id="photos"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <FileImage className="h-4 w-4 flex-shrink-0" />
                        <span>Format: JPG, JPEG, PNG. Maks 2MB per file.</span>
                    </div>
                    <InputError message={errors.photos} />
                </div>

                {(visibleExistingPhotos.length > 0 ||
                    newPreviews.length > 0) && <Separator />}

                {(visibleExistingPhotos.length > 0 ||
                    newPreviews.length > 0) && (
                    <p className="text-sm font-medium">
                        Total Foto ({visibleExistingPhotos.length + newPreviews.length})
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {/* Pratinjau foto yang sudah ada */}
                    {visibleExistingPhotos.map((photo) => (
                        <div key={photo.id} className="relative">
                            <img
                                src={`/storage/${photo.photo_path}`}
                                alt="Foto program"
                                className="h-24 w-full rounded-md object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={() => removeExistingImage(photo.id)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    {/* Pratinjau foto baru */}
                    {newPreviews.map((src, index) => (
                        <div key={src} className="relative">
                            <img
                                src={src}
                                alt={`Preview ${index}`}
                                className="h-24 w-full rounded-md object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={() => removeNewImage(index)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PhotoManager;
