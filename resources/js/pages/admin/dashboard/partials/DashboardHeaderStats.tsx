import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Banknote, Users } from 'lucide-react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={`rounded-lg p-2 ${bgColor}`}>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function DashboardHeaderStats({
    performanceStats,
    realtimeStats,
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatCard
                title="Total Dana Terkumpul (Sesuai Filter)"
                value={formatCurrency(performanceStats.danaTerkumpul.total)}
                icon={ArrowUpRight}
                color="text-green-600"
                bgColor="bg-green-100"
            />
            <StatCard
                title="Total Dana Disalurkan (Sesuai Filter)"
                value={formatCurrency(performanceStats.danaDisalurkan.total)}
                icon={ArrowDownRight}
                color="text-red-600"
                bgColor="bg-red-100"
            />
            <StatCard
                title="Total Mustahik Terbantu"
                value={realtimeStats.totalMustahikDisetujui}
                icon={Users}
                color="text-sky-600"
                bgColor="bg-sky-100"
            />
            <StatCard
                title="Program Aktif"
                value={realtimeStats.programPublished}
                icon={Banknote}
                color="text-violet-600"
                bgColor="bg-violet-100"
            />
        </div>
    );
}
