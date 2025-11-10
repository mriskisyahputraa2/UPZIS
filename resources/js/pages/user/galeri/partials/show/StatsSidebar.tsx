import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Banknote,
    CalendarDays,
    GalleryHorizontal,
    Info,
    Users,
} from 'lucide-react';

const StatItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default function StatsSidebar({ program }) {
    return (
        <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                            <Info className="h-5 w-5 text-green-700" />
                            Ringkasan Program
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <StatItem
                            icon={CalendarDays}
                            label="Tanggal Program"
                            value={format(
                                new Date(program.program_date),
                                'dd MMMM yyyy',
                                { locale: id },
                            )}
                        />
                        <StatItem
                            icon={Banknote}
                            label="Total Dana Disalurkan"
                            value={formatCurrency(
                                program.penyalurans_sum_amount,
                            )}
                        />
                        <StatItem
                            icon={Users}
                            label="Penerima Manfaat"
                            value={`${program.penyalurans_count} Orang`}
                        />
                    </CardContent>
                </Card>

                <div className="rounded-xl bg-gray-50 p-6 text-center shadow-inner">
                    <Link href="/galeri">
                        <Button
                            variant="outline"
                            className="w-full bg-white shadow-sm"
                        >
                            <GalleryHorizontal className="mr-2 h-4 w-4" />
                            Kembali ke Galeri
                        </Button>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
