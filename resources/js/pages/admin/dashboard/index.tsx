import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Info } from 'lucide-react';

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
    activePeriode,
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

                {activePeriode ? (
                    <Alert variant="info">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Periode Pendaftaran Aktif</AlertTitle>
                        <AlertDescription>
                            Saat ini periode pendaftaran yang sedang aktif
                            adalah{' '}
                            <strong className="text-green-600">
                                {activePeriode.name}
                            </strong>
                            .
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Tidak Ada Periode Aktif</AlertTitle>
                        <AlertDescription>
                            Formulir pendaftaran publik saat ini sedang ditutup.{' '}
                            <Button
                                variant="link"
                                asChild
                                className="ml-1 h-auto p-0"
                            >
                                <Link href="/admin/periode">
                                    Aktifkan periode.
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

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
