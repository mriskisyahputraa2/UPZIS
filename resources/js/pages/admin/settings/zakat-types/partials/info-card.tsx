import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * @name InfoCard
 * @description Komponen kartu yang menampilkan informasi bantuan terkait jenis zakat.
 * @returns {JSX.Element}
 */
const InfoCard = () => {
    return (
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0 text-blue-500">
                <Info className="h-5 w-5" />
                <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                    <p>
                        <strong>Rate (%)</strong> adalah persentase yang akan
                        dikalikan dengan harta muzakki. Umumnya 2.5% untuk zakat
                        mal.
                    </p>
                    <p>
                        <strong>Nisab</strong> adalah batas minimum harta wajib
                        zakat. Basis nisab (emas, perak, dll.) akan ditampilkan
                        sebagai satuan.
                    </p>
                    <p>
                        Status <strong>"Tidak Aktif"</strong> akan
                        menyembunyikan jenis zakat ini dari pilihan di
                        kalkulator zakat.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
