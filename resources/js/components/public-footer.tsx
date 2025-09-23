import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Youtube,
} from 'lucide-react';
import AppLogo from './app-logo'; // Asumsi Anda punya komponen Logo

// Kita gunakan lagi data navigasi yang sama dengan header agar konsisten
const publicNavItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Galeri Program', href: '/galeri' },
    { title: 'Kalkulator Zakat', href: '/kalkulator' },
    { title: 'Ajukan Bantuan', href: '/ajukan-bantuan' },
    { title: 'Kontak', href: '/kontak' },
];

// Data untuk link media sosial (silakan sesuaikan)
const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Youtube, href: '#', name: 'Youtube' },
];

export function PublicFooter() {
    return (
        <footer className="bg-green-700 text-white">
            <div className="container mx-auto max-w-7xl px-6 py-16">
                {/* Bagian utama footer dengan 4 kolom */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    {/* Kolom 1: Logo & Deskripsi */}
                    <div className="md:col-span-12 lg:col-span-4">
                        <AppLogo className="h-10 w-auto" />
                        <p className="mt-4 text-sm text-green-100">
                            Lembaga Amil Zakat yang berfokus pada penghimpunan
                            dan penyaluran dana zakat, infaq, dan shadaqah
                            secara amanah, profesional, dan transparan.
                        </p>
                    </div>

                    {/* Kolom 2: Tautan Cepat */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-lg font-semibold">Tautan Cepat</h3>
                        <ul className="mt-4 space-y-2">
                            {publicNavItems.map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-green-100 hover:text-white hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Hubungi Kami */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-lg font-semibold">Hubungi Kami</h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-start">
                                <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-green-100">
                                    Jalan Tgk. Daud Beureueh, Banda Aceh, Aceh,
                                    Indonesia
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-green-100">
                                    (0651) 123-456
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-green-100">
                                    info@upzis.com
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 4: Media Sosial */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-lg font-semibold">Ikuti Kami</h3>
                        <p className="mt-4 text-sm text-green-100">
                            Dapatkan informasi terbaru mengenai program kami
                            melalui media sosial.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-100 hover:text-white"
                                >
                                    <span className="sr-only">
                                        {social.name}
                                    </span>
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian bawah footer untuk copyright */}
            <div className="bg-green-800">
                <div className="container mx-auto max-w-7xl px-6 py-4 text-center text-sm text-green-200">
                    &copy; {new Date().getFullYear()} UPZIS. All Rights
                    Reserved.
                </div>
            </div>
        </footer>
    );
}
