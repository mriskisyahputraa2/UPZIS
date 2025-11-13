import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import React from 'react';

/**
 * @summary Properti untuk komponen FormActions.
 */
interface FormActionsProps {
    /** Status processing form, untuk menonaktifkan tombol simpan. */
    isProcessing: boolean;
    /** URL tujuan untuk tombol "Batal". */
    backHref: string;
    /** Teks untuk tombol submit saat tidak dalam status processing. */
    saveText?: string;
    /** Teks untuk tombol submit saat dalam status processing. */
    processingText?: string;
}

/**
 * @summary Komponen untuk menampilkan tombol aksi pada form.
 * @description Menampilkan tombol "Batal" yang mengarah ke `backHref` dan tombol "Simpan"
 *              yang statusnya (teks dan disabled) dikontrol oleh `isProcessing`.
 * @param {FormActionsProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen tombol aksi form.
 */
export default function FormActions({
    isProcessing,
    backHref,
    saveText = 'Simpan Data',
    processingText = 'Menyimpan...',
}: FormActionsProps): JSX.Element {
    return (
        <div className="flex justify-end gap-4 pt-6">
            <Link href={backHref}>
                <Button type="button" variant="outline">
                    Batal
                </Button>
            </Link>
            <Button type="submit" disabled={isProcessing}>
                {isProcessing ? processingText : saveText}
            </Button>
        </div>
    );
}
