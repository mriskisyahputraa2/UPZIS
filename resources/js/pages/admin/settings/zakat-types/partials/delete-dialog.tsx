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

/**
 * @interface DeleteDialogProps
 * @description Properti untuk komponen DeleteDialog.
 * @property {boolean} open - Status untuk menampilkan atau menyembunyikan dialog.
 * @property {() => void} onOpenChange - Handler saat status `open` berubah.
 * @property {() => void} onConfirm - Handler saat tombol konfirmasi (Hapus) di-klik.
 */
interface DeleteDialogProps {
    open: boolean;
    onOpenChange: () => void;
    onConfirm: () => void;
}

/**
 * @name DeleteDialog
 * @description Komponen dialog konfirmasi untuk tindakan penghapusan data.
 * @param {DeleteDialogProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const DeleteDialog = ({ open, onOpenChange, onConfirm }: DeleteDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini akan menghapus data jenis zakat secara
                        permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
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
};

export default DeleteDialog;
