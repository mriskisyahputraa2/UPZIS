import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/publicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import TransactionHistory from './partials/TransactionHistory';
import UpdatePasswordForm from './partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './partials/UpdateProfileInformationForm';

export default function Index({ transactions, status }) {
    const { props } = usePage();
    const {
        recentlySuccessful: profileRecentlySuccessful,
        errors: profileErrors,
    } = props.jetstream || {};
    const {
        recentlySuccessful: passwordRecentlySuccessful,
        errors: passwordErrors,
    } = props.jetstream || {};

    useEffect(() => {
        if (status === 'profile-updated' || profileRecentlySuccessful) {
            toast.success('Profil berhasil diperbarui.');
        } else if (
            status === 'password-updated' ||
            passwordRecentlySuccessful
        ) {
            toast.success('Password berhasil diubah.');
        } else if (status === 'photo-updated') {
            toast.success('Foto profil berhasil diubah.');
        }
    }, [status, profileRecentlySuccessful, passwordRecentlySuccessful]);

    return (
        <PublicLayout>
            <Head title="Profil Saya" />
            <Toaster richColors position="top-center" />

            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-7xl px-6">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Akun Saya
                    </h1>
                    <p className="mt-2 text-lg text-green-100">
                        Kelola informasi akun dan lihat riwayat transaksi Anda.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-7xl px-6">
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="mx-auto grid h-12 w-full max-w-md grid-cols-2">
                            <TabsTrigger value="profile" className="text-base">
                                Profil Saya
                            </TabsTrigger>
                            <TabsTrigger value="history" className="text-base">
                                Riwayat Transaksi
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-6">
                            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                                <UpdateProfileInformationForm />
                                <UpdatePasswordForm />
                            </div>
                        </TabsContent>

                        <TabsContent value="history" className="mt-6">
                            <TransactionHistory transactions={transactions} />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </PublicLayout>
    );
}
