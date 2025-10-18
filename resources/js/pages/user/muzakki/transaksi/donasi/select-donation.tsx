import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import { HandCoins, Landmark, Scale } from 'lucide-react';

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
            <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Salurkan Kebaikan Anda
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Pilih jenis donasi yang ingin Anda tunaikan. Setiap
                        kebaikan Anda sangat berarti.
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-4xl px-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {donationTypes.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group block transform rounded-xl border bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <item.icon className="mx-auto h-12 w-12 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                                <h3 className="mt-4 text-2xl font-bold text-gray-800">
                                    {item.name}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    {item.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
