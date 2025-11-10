/**
 * @file index.tsx
 * @description Halaman utama untuk fitur kontak.
 * Halaman ini menggabungkan beberapa komponen parsial untuk membentuk
 * tata letak halaman kontak yang lengkap, termasuk header, informasi kontak,
 * formulir pengiriman pesan, dan peta lokasi.
 *
 * @component ContactIndex
 * @returns {JSX.Element} - Komponen halaman kontak yang telah disusun.
 *
 * @requires @/layouts/publicLayout - Layout utama untuk halaman publik.
 * @requires @inertiajs/react - Untuk `Head` dan `usePage` untuk mengakses props.
 * @requires @/components/ui/card - Komponen Card untuk membungkus konten utama.
 * @requires ./partials/ContactHeader - Komponen header halaman.
 * @requires ./partials/ContactInfo - Komponen untuk menampilkan detail kontak.
 * @requires ./partials/ContactForm - Komponen formulir kontak.
 * @requires ./partials/ContactMap - Komponen peta lokasi.
 */

import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/publicLayout';
import { Head, usePage } from '@inertiajs/react';
import ContactForm from './partials/ContactForm';
import ContactHeader from './partials/ContactHeader';
import ContactInfo from './partials/ContactInfo';
import ContactMap from './partials/ContactMap';

export default function ContactIndex() {
    // Mengambil props `generalSettings` dan `flash` dari Inertia.
    const { generalSettings, flash } = usePage().props as any;

    return (
        <PublicLayout>
            <Head title="Hubungi Kami" />

            {/* Bagian Header */}
            <ContactHeader />

            {/* Bagian Konten Utama (Info & Form) */}
            <section className="-mt-10 pb-12 md:pb-16">
                <div className="container mx-auto max-w-7xl px-4">
                    <Card className="overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-5">
                                {/* Komponen Informasi Kontak */}
                                <ContactInfo settings={generalSettings} />

                                {/* Komponen Formulir Kontak */}
                                <ContactForm flash={flash} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Bagian Peta Lokasi */}
            <ContactMap />
        </PublicLayout>
    );
}