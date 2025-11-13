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
 * @description Komponen header untuk halaman daftar program.
 * @returns {JSX.Element}
 */
const Header = () => {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Daftar Program Penyaluran</CardTitle>
                <Link href="/admin/programs/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Program
                    </Button>
                </Link>
            </div>
            <CardDescription>
                Kelola program yang akan ditampilkan di halaman Galeri Program
                publik.
            </CardDescription>
        </CardHeader>
    );
};

export default Header;
