import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/publicLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import ProfileSidebarNav from './partials/ProfileSidebarNav';
import TransactionHistory from './partials/TransactionHistory';
import UpdatePasswordForm from './partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './partials/UpdateProfileInformationForm';

export default function Index({
    transactions,
    status,
    activeView,
}: {
    transactions: any;
    status: string | null;
    activeView: string;
}) {
    useEffect(() => {
        if (status) {
            if (status === 'profile-updated' || status === 'photo-updated') {
                toast.success('Profil berhasil diperbarui.');
            } else if (status === 'password-updated') {
                toast.success('Password berhasil diubah.');
            }
        }
    }, [status]);

    const handleSetActiveView = (view: string) => {
        router.get(
            '/profile',
            { view },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <PublicLayout>
            <Head title="Profil Saya" />
            <Toaster richColors position="top-center" />

            <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
                <div className="container mx-auto max-w-7xl px-6">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Profile Saya
                    </h1>
                    <p className="mt-2 text-lg text-green-100">
                        Kelola informasi akun dan lihat riwayat transaksi Anda.
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Kolom Kiri: Sidebar Navigasi */}
                        <div className="lg:col-span-1">
                            <Card className="shadow-lg">
                                <CardContent className="p-2">
                                    <ProfileSidebarNav
                                        active={activeView}
                                        setActive={handleSetActiveView}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Kolom Kanan: Konten Dinamis */}
                        <div className="lg:col-span-3">
                            {activeView === 'profile' && (
                                <UpdateProfileInformationForm className="shadow-lg" />
                            )}
                            {activeView === 'password' && (
                                <UpdatePasswordForm className="shadow-lg" />
                            )}
                            {activeView === 'history' && (
                                <TransactionHistory
                                    transactions={transactions}
                                    className="shadow-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
