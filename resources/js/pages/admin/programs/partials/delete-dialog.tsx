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
import { ProgramListItem } from '@/types/program';

/**
 * @interface DeleteDialogProps
 * @description Properti untuk komponen DeleteDialog.
 */
interface DeleteDialogProps {
    target: ProgramListItem | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

/**
 * @name DeleteDialog
 * @description Komponen dialog konfirmasi untuk tindakan penghapusan program.
 * @returns {JSX.Element}
 */
const DeleteDialog = ({
    target,
    onOpenChange,
    onConfirm,
}: DeleteDialogProps) => {
    return (
        <AlertDialog
            open={!!target}
            onOpenChange={(open) => onOpenChange(open)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini akan menghapus program{' '}
                        <strong>{target?.name}</strong> beserta semua fotonya
                        secara permanen.
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

export default DeleteDialog;
