import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Info } from 'lucide-react';
import LaporanTab from './partials/LaporanTab';
import RingkasanTab from './partials/RingkasanTab';

export default function Dashboard({
    realtimeStats,
    performanceStats,
    activeFilters,
    activePeriode,
    periodes,
}) {
    const breadcrumbs = [{ title: 'Dashboard' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Analitik</h1>
                    <p className="text-muted-foreground">
                        Ringkasan aktivitas dan dana di UPZIS.
                    </p>
                </div>

                {activePeriode ? (
                    <Alert
                        variant="info"
                        className="border-blue-200 bg-blue-50"
                    >
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="font-bold text-blue-800">
                            Periode Pendaftaran Aktif
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                            Pendaftaran dibuka untuk periode:{' '}
                            <strong>{activePeriode.name}</strong>.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert
                        variant="warning"
                        className="border-yellow-200 bg-yellow-50"
                    >
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="font-bold text-yellow-800">
                            Pendaftaran Ditutup
                        </AlertTitle>
                        <AlertDescription className="text-yellow-700">
                            Tidak ada periode pendaftaran aktif.{' '}
                            <Button
                                variant="link"
                                asChild
                                className="h-auto p-0 text-yellow-800 hover:text-yellow-900"
                            >
                                <Link href="/admin/periode">
                                    Aktifkan Periode
                                </Link>
                            </Button>
                            .
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="ringkasan" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ringkasan">
                            Ringkasan Real-time
                        </TabsTrigger>
                        <TabsTrigger value="laporan">
                            Laporan Performa
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ringkasan" className="mt-6">
                        <RingkasanTab stats={realtimeStats} />
                    </TabsContent>

                    <TabsContent value="laporan" className="mt-6">
                        <LaporanTab
                            stats={performanceStats}
                            periodes={periodes}
                            activeFilters={activeFilters}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
