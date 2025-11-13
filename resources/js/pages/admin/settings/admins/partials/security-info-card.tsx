import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * @name SecurityInfoCard
 * @description Komponen kartu yang menampilkan informasi bantuan terkait keamanan akun.
 * @returns {JSX.Element}
 */
const SecurityInfoCard = () => {
    return (
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0 text-yellow-600">
                <Info className="h-5 w-5" />
                <CardTitle>Keamanan Akun</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                    <p>
                        Pastikan Anda menggunakan{' '}
                        <strong>password yang kuat</strong> dan unik untuk
                        setiap akun admin.
                    </p>
                    <p>
                        Alamat email harus <strong>unik</strong> dan belum
                        pernah terdaftar di sistem ini sebagai pengguna lain.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SecurityInfoCard;
