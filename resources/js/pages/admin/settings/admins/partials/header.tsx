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
 * @description Komponen header untuk halaman daftar admin.
 * @returns {JSX.Element}
 */
const Header = () => {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Daftar Admin</CardTitle>
                <Link href="/admin/settings/admins/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Admin
                    </Button>
                </Link>
            </div>
            <CardDescription>
                Kelola akun yang memiliki akses ke panel admin.
            </CardDescription>
        </CardHeader>
    );
};

export default Header;
