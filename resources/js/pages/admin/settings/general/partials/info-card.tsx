import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * @name InfoCard
 * @description Komponen kartu yang menampilkan informasi bantuan terkait pengaturan.
 * @returns {JSX.Element}
 */
const InfoCard = () => {
    return (
        <Card className="sticky top-24">
            <CardHeader className="flex-row items-center gap-2 space-y-0 text-red-600">
                <Info className="h-5 w-5" />
                <CardTitle>Informasi Pengaturan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                    <p>
                        <strong>Alokasi Dana</strong> adalah persentase dari
                        total dana donasi yang akan dialokasikan khusus untuk
                        kategori Masyarakat Umum (Fakir Miskin).
                    </p>
                    <p>
                        <strong>Harga Emas</strong> adalah patokan utama untuk
                        menghitung nisab di <strong>Kalkulator Zakat</strong>.
                        Perbarui secara berkala.
                    </p>
                    <p>
                        <strong>Informasi Kontak</strong> akan ditampilkan
                        secara otomatis di footer dan halaman publik lainnya.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
