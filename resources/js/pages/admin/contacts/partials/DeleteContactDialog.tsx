/**
 * @file DeleteContactDialog.tsx
 * @description Komponen dialog konfirmasi untuk menghapus pesan kontak.
 *
 * @component DeleteContactDialog
 * @param {object} props - Properti komponen.
 * @param {boolean} props.isOpen - State untuk mengontrol visibilitas dialog.
 * @param {(open: boolean) => void} props.onOpenChange - Fungsi untuk mengubah state visibilitas.
 * @param {() => void} props.onConfirm - Fungsi yang dieksekusi saat penghapusan dikonfirmasi.
 * @param {object | null} props.contact - Objek kontak yang akan dihapus.
 * @returns {JSX.Element} Komponen dialog konfirmasi.
 */
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

interface Contact {
    id: number;
    name: string;
}

interface DeleteContactDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    contact: Contact | null;
}

const DeleteContactDialog: React.FC<DeleteContactDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
    contact,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda yakin ingin menghapus pesan dari{' '}
                        <strong>{contact?.name}</strong>? Tindakan ini tidak
                        dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Ya, Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteContactDialog;
