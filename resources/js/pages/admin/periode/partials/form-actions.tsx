import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

/**
 * @interface FormActionsProps
 * @description Properti untuk komponen FormActions.
 * @property {boolean} processing - Status loading dari form.
 * @property {string} backUrl - URL untuk tombol batal.
 * @property {string} [submitText='Simpan'] - Teks untuk tombol submit.
 * @property {string} [processingText='Menyimpan...'] - Teks saat tombol submit dalam status processing.
 */
interface FormActionsProps {
    processing: boolean;
    backUrl: string;
    submitText?: string;
    processingText?: string;
}

/**
 * @name FormActions
 * @description Komponen untuk menampilkan tombol aksi (Batal, Simpan) pada sebuah form.
 * @param {FormActionsProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const FormActions = ({
    processing,
    backUrl,
    submitText = 'Simpan',
    processingText = 'Menyimpan...',
}: FormActionsProps) => {
    return (
        <div className="flex justify-end gap-4 pt-6">
            <Link href={backUrl}>
                <Button type="button" variant="outline">
                    Batal
                </Button>
            </Link>
            <Button type="submit" disabled={processing}>
                {processing ? processingText : submitText}
            </Button>
        </div>
    );
};

export default FormActions;
