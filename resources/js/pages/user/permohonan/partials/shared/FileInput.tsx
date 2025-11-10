import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { File, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

/**
 * @typedef {object} FileInputProps
 * @property {string} id - ID unik untuk elemen input.
 * @property {string} label - Teks label untuk input file.
 * @property {File | null} file - Objek file yang saat ini dipilih.
 * @property {(file: File | null) => void} onFileChange - Fungsi callback yang dipanggil saat file berubah.
 * @property {string} [error] - Pesan error yang akan ditampilkan.
 */

/**
 * Komponen input file kustom dengan fungsionalitas drag-and-drop.
 * Menampilkan nama file yang dipilih dan tombol untuk menghapusnya,
 * atau area dropzone jika tidak ada file yang dipilih.
 *
 * @param {FileInputProps} props - Properti untuk komponen FileInput.
 * @returns {JSX.Element}
 */
const FileInput = ({ id, label, file, onFileChange, error }) => {
    const [isDragging, setIsDragging] = useState(false);

    /**
     * Menangani perubahan pada input file.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event perubahan.
     */
    const handleFileChange = (e) =>
        onFileChange(e.target.files ? e.target.files[0] : null);

    /**
     * Menangani file yang di-drop ke area dropzone.
     * @param {React.DragEvent<HTMLLabelElement>} e - Event drop.
     */
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="truncate font-semibold">
                {label} <span className="text-red-500">*</span>
            </Label>
            {file ? (
                <div className="flex items-center justify-between rounded-lg border bg-green-50 p-3 dark:bg-green-900/20">
                    <div className="flex min-w-0 items-center gap-3">
                        <File className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="truncate text-sm font-medium text-green-800 dark:text-green-300">
                            {file.name}
                        </span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 text-red-500 hover:bg-red-100"
                        onClick={() => onFileChange(null)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                        isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-muted-foreground">
                        Seret file atau klik
                    </span>
                </label>
            )}
            <Input
                id={id}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                required
            />
            <InputError message={error} />
        </div>
    );
};

export default FileInput;
