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
 * @description Komponen header untuk halaman daftar jenis zakat.
 * @returns {JSX.Element}
 */
const Header = () => {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Daftar Jenis Zakat</CardTitle>
                <Link href="/admin/settings/zakat-types/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Jenis Zakat
                    </Button>
                </Link>
            </div>
            <CardDescription>
                Kelola jenis zakat yang akan digunakan di kalkulator zakat.
            </CardDescription>
        </CardHeader>
    );
};

export default Header;
