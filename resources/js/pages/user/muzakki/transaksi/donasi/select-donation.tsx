import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import { HandCoins, Landmark, Scale } from 'lucide-react';
import PageHeader from '../partials/PageHeader';
import DonationTypeCard from './partials/DonationTypeCard';

export default function SelectDonation() {
    const donationTypes = [
        {
            name: 'Zakat',
            description:
                'Tunaikan kewajiban untuk membersihkan harta dan jiwa.',
            href: '/donasi/zakat',
            icon: Scale,
        },
        {
            name: 'Infaq',
            description: 'Salurkan sebagian harta untuk kemaslahatan umum.',
            href: '/donasi/infaq',
            icon: HandCoins,
        },
        {
            name: 'Sedekah',
            description: 'Berikan kebaikan dalam bentuk apapun dengan ikhlas.',
            href: '/donasi/sedekah',
            icon: Landmark,
        },
    ];

    return (
        <PublicLayout>
            <Head title="Pilih Jenis Donasi" />

            <PageHeader
                title="Salurkan Kebaikan Anda"
                description="Pilih jenis donasi yang ingin Anda tunaikan. Setiap kebaikan Anda sangat berarti."
            />

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-4xl px-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {donationTypes.map((item) => (
                            <DonationTypeCard
                                key={item.name}
                                name={item.name}
                                description={item.description}
                                href={item.href}
                                icon={item.icon}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
