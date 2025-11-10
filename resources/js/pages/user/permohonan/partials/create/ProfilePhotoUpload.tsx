import InputError from '@/components/input-error';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileUp, User as UserIcon } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} ProfilePhotoUploadProps
 * @property {string | null} previewImage - URL pratinjau gambar yang dipilih.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} handlePhotoChange - Fungsi untuk menangani perubahan input file foto.
 * @property {string} [error] - Pesan error validasi untuk field foto.
 */

/**
 * Komponen untuk langkah pertama formulir: mengunggah foto profil.
 * Terdiri dari area untuk pratinjau gambar dan input file tersembunyi.
 *
 * @param {ProfilePhotoUploadProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const ProfilePhotoUpload = ({ previewImage, handlePhotoChange, error }) => {
    return (
        <Card className="shadow-lg duration-500 animate-in fade-in slide-in-from-bottom-5">
            <CardHeader>
                <CardTitle className="flex items-center gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                        1
                    </span>
                    <span className="text-xl">Unggah Foto Profil</span>
                </CardTitle>
                <CardDescription className="pt-1 pl-12">
                    Unggah foto formal atau semi-formal Anda (wajah terlihat
                    jelas).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pl-12">
                <label
                    htmlFor="photo"
                    className="group relative h-48 w-48 cursor-pointer"
                >
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="h-full w-full rounded-full object-cover shadow-md transition-opacity group-hover:opacity-50"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed bg-gray-50 transition-colors group-hover:border-primary">
                            <UserIcon className="h-16 w-16 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <FileUp className="h-8 w-8 text-white" />
                    </div>
                </label>
                <Input
                    id="photo"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                    required
                />
                <InputError message={error} />
            </CardContent>
        </Card>
    );
};

export default ProfilePhotoUpload;
