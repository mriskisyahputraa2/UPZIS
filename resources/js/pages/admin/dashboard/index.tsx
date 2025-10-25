import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

// Import semua partials yang baru kita buat
import AlokasiZakatCard from './partials/AlokasiZakatCard';
import DashboardHeaderStats from './partials/DashboardHeaderStats';
import LaporanFilterPanel from './partials/LaporanFilterPanel';
import LaporanPerformaCards from './partials/LaporanPerformaCards';
import TugasDanAktivitas from './partials/TugasDanAktivitas';

export default function Dashboard({
    realtimeStats,
    performanceStats,
    activeFilters,
    periodes,
    alokasiAturan,
}) {
    const breadcrumbs = [{ title: 'Dashboard' }];
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {/* BAGIAN 1: HEADER & KPI UTAMA */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Selamat Datang Kembali, {auth.user.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        Berikut adalah ringkasan aktivitas dan performa UPZIS.
                    </p>
                </div>
                <DashboardHeaderStats
                    performanceStats={performanceStats}
                    realtimeStats={realtimeStats}
                />

                {/* BAGIAN 2: LAPORAN PERFORMA DENGAN FILTER */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Laporan Performa</h2>
                    <LaporanFilterPanel
                        periodes={periodes}
                        activeFilters={activeFilters}
                    />
                    <AlokasiZakatCard alokasiAturan={alokasiAturan} />
                    <LaporanPerformaCards performanceStats={performanceStats} />
                </div>

                {/* BAGIAN 3: TUGAS & AKTIVITAS TERBARU */}
                <TugasDanAktivitas realtimeStats={realtimeStats} />
            </main>
        </AppLayout>
    );
}
