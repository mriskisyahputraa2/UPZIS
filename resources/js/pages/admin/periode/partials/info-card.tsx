import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * @name InfoCard
 * @description Komponen untuk menampilkan kartu informasi penting terkait aturan bisnis periode.
 * @returns {JSX.Element}
 */
const InfoCard = () => {
    return (
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0 text-red-500">
                <Info className="h-5 w-5" />
                <CardTitle>Informasi Penting</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                    <p>
                        Pastikan <strong>Tanggal Mulai</strong> harus lebih
                        kecil dari <strong>Tanggal Selesai</strong>.
                    </p>
                    <p>
                        Sistem hanya mengizinkan <strong>satu periode</strong>{' '}
                        untuk berstatus <strong>"Aktif"</strong> dalam satu
                        waktu.
                    </p>
                    <p>
                        Mengubah status periode menjadi <strong>"Aktif"</strong>{' '}
                        akan secara otomatis <strong>menonaktifkan</strong>{' '}
                        periode lain yang sedang aktif.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
