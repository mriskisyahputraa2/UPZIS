import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import React from 'react';

/**
 * @summary Properti untuk komponen DeleteDialog.
 */
interface DeleteDialogProps {
    /** Status keterbukaan dialog. */
    isOpen: boolean;
    /** Fungsi untuk menutup dialog. */
    onClose: () => void;
    /** Fungsi yang akan dieksekusi saat tombol "Hapus" diklik. */
    onConfirm: () => void;
    /** Judul dialog. */
    title?: string;
    /** Deskripsi atau pesan dalam dialog. */
    description?: string;
}

/**
 * @summary Komponen dialog konfirmasi penghapusan.
 * @description Menampilkan dialog modal untuk meminta konfirmasi dari pengguna
 *              sebelum melakukan tindakan penghapusan data secara permanen.
 * @param {DeleteDialogProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen dialog konfirmasi.
 */
export default function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Apakah Anda Yakin?',
    description = 'Tindakan ini akan menghapus data secara permanen dan tidak dapat dibatalkan.',
}: DeleteDialogProps): JSX.Element {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
