import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { GraduationCap, HeartHandshake } from 'lucide-react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function AlokasiZakatCard({ alokasiAturan }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Total Alokasi Dana Zakat (Sepanjang Masa)</CardTitle>
                <CardDescription>
                    Total dana yang dialokasikan berdasarkan persentase dari
                    seluruh penerimaan zakat.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-6 w-6 text-sky-600" />
                            <span className="font-medium text-muted-foreground">
                                Alokasi Kampus (Mahasiswa)
                            </span>
                        </div>
                        <span className="text-2xl font-bold">
                            {formatCurrency(alokasiAturan.kampus.total_alokasi)}
                        </span>
                    </div>
                    <div className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
                        {alokasiAturan.kampus.persen}%
                    </div>
                </div>
                <div className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <HeartHandshake className="h-6 w-6 text-emerald-600" />
                            <span className="font-medium text-muted-foreground">
                                Alokasi Fakir Miskin
                            </span>
                        </div>
                        <span className="text-2xl font-bold">
                            {formatCurrency(
                                alokasiAturan.fakir_miskin.total_alokasi,
                            )}
                        </span>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                        {alokasiAturan.fakir_miskin.persen}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
