import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

/**
 * @interface FormHeaderProps
 * @description Properti untuk komponen FormHeader.
 * @property {string} title - Judul utama header.
 * @property {string} description - Deskripsi singkat di bawah judul.
 * @property {string} backUrl - URL untuk tombol kembali.
 */
interface FormHeaderProps {
    title: string;
    description: string;
    backUrl: string;
}

/**
 * @name FormHeader
 * @description Komponen header untuk halaman form, berisi tombol kembali, judul, dan deskripsi.
 * @param {FormHeaderProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const FormHeader = ({ title, description, backUrl }: FormHeaderProps) => {
    return (
        <div className="flex items-center gap-3">
            <Link href={backUrl}>
                <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};

export default FormHeader;
