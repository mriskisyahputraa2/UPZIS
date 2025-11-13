import { Button } from '@/components/ui/button';

/**
 * @interface FormActionsProps
 * @description Properti untuk komponen FormActions.
 * @property {boolean} processing - Status loading dari form.
 */
interface FormActionsProps {
    processing: boolean;
}

/**
 * @name FormActions
 * @description Komponen untuk menampilkan tombol aksi (Simpan) pada form pengaturan.
 * @param {FormActionsProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const FormActions = ({ processing }: FormActionsProps) => {
    return (
        <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
            </Button>
        </div>
    );
};

export default FormActions;
