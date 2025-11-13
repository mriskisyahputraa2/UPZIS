import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import PenyaluranForm from '@/pages/admin/permohonan/partials/PenyaluranForm';
import { Mustahik, PageProps } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, User } from 'lucide-react';
import { useState } from 'react';
import PageHeader from './partials/PageHeader';
import DetailProfilTab from './partials/show/DetailProfilTab';
import RiwayatPermohonanTab from './partials/show/RiwayatPermohonanTab';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Detail Mustahik' },
];

interface ShowProps extends PageProps {
    mustahik: Mustahik & {
        permohonans: any[]; // Ganti 'any' dengan tipe yang lebih spesifik
    };
    availableFunds: any; // Ganti 'any' dengan tipe yang lebih spesifik
}

/**
 * @summary Halaman untuk menampilkan detail data mustahik.
 * @description Menampilkan semua informasi terkait seorang mustahik, termasuk profil,
 *              data ekonomi, dan riwayat permohonan bantuan dalam format tab.
 * @param {ShowProps} props - Properti yang berisi data mustahik dan dana yang tersedia.
 * @returns {JSX.Element} Halaman detail mustahik.
 */
export default function Show({ mustahik, availableFunds }: ShowProps) {
    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null); // State ini mungkin perlu dipindah jika dialognya direfactoring
    const latestPermohonan = mustahik.permohonans[0];
    const isMahasiswa = latestPermohonan?.kategori_pemohon === 'mahasiswa';

    // Fungsi ini mungkin perlu dipindah jika dialognya direfactoring
    const handleDeletePenyaluran = () => {
        if (toDelete) {
            router.delete(`/admin/penyaluran/${toDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => setToDelete(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <PageHeader
                    title="Detail Mustahik"
                    description={`Data lengkap untuk "${mustahik.name}"`}
                    backHref="/admin/mustahiks"
                >
                    <Button asChild variant="outline">
                        <a href="/admin/mustahiks">Kembali</a>
                    </Button>
                    <Button asChild>
                        <a href={`/admin/mustahiks/${mustahik.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Data Induk
                        </a>
                    </Button>
                </PageHeader>

                <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden text-center">
                            <CardContent className="flex flex-col items-center gap-4 p-6">
                                <div className="h-48 w-full">
                                    {mustahik.photo ? (
                                        <img
                                            src={`/storage/${mustahik.photo}`}
                                            alt={mustahik.name}
                                            className="h-full w-full rounded-xl object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                                            <User className="h-24 w-24 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">
                                        {mustahik.name}
                                    </h2>
                                    <Badge
                                        variant={
                                            isMahasiswa
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {isMahasiswa
                                            ? 'Mahasiswa'
                                            : 'Fakir/Miskin'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Tabs defaultValue="profil" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profil">
                                    Profil Detail
                                </TabsTrigger>
                                <TabsTrigger value="riwayat">
                                    Riwayat Permohonan
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profil" className="mt-6">
                                <DetailProfilTab
                                    mustahik={mustahik}
                                    isMahasiswa={isMahasiswa}
                                />
                            </TabsContent>

                            <TabsContent value="riwayat" className="mt-6">
                                <RiwayatPermohonanTab
                                    permohonans={mustahik.permohonans}
                                    setToEdit={setToEdit}
                                    setToDelete={setToDelete}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Dialog untuk Edit/Tambah Penyaluran masih di sini untuk saat ini */}
            <Dialog open={!!toEdit} onOpenChange={() => setToEdit(null)}>
                {toEdit && (
                    <PenyaluranForm
                        permohonan={mustahik.permohonans.find(
                            (p) => p.id === toEdit.permohonan_id,
                        )}
                        penyaluran={toEdit}
                        availableFunds={availableFunds}
                        onOpenChange={() => setToEdit(null)}
                        onSuccess={() => setToEdit(null)}
                    />
                )}
            </Dialog>

            {/* Dialog untuk Hapus Penyaluran bisa direfactoring ke komponennya sendiri jika diperlukan */}
        </AppLayout>
    );
}
