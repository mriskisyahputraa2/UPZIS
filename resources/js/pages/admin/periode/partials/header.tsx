import { Button } from '@/components/ui/button';
import {
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

/**
 * @name Header
 * @description Komponen header untuk halaman daftar periode.
 * @returns {JSX.Element}
 */
const Header = () => {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Daftar Periode</CardTitle>
                <Link href="/admin/periode/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Periode
                    </Button>
                </Link>
            </div>
            <CardDescription>
                Kelola siklus pendaftaran dan penyaluran bantuan di sini.
            </CardDescription>
        </CardHeader>
    );
};

export default Header;
