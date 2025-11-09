import { Link } from '@inertiajs/react';
// 1. Menggunakan ikon kontak dari 'react-icons' juga untuk konsistensi monokrom
import {
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaMapPin,
    FaPhone,
    FaTiktok,
    FaXTwitter,
    FaYoutube,
} from 'react-icons/fa6';
import AppLogo from './app-logo';

// Data navigasi
const publicNavItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Galeri Program', href: '/galeri' },
    { title: 'Kalkulator Zakat', href: '/kalkulator-zakat' },
    { title: 'Ajukan Bantuan', href: '/ajukan-bantuan' },
    { title: 'Kontak', href: '/kontak' },
];

// 2. Data socialLinks kini hanya berisi ikon dan href, tidak ada bgClass
const socialLinks = [
    {
        icon: FaFacebookF,
        href: 'https://web.facebook.com/politekniknegerilhokseumaweofficial?_rdc=1&_rdr#',
        name: 'Facebook',
    },
    {
        icon: FaInstagram,
        href: 'https://www.instagram.com/pnl_manunggal/',
        name: 'Instagram',
    },
    {
        icon: FaXTwitter,
        href: 'https://x.com/pnl_manunggal',
        name: 'X (Twitter)',
    },
    {
        icon: FaYoutube,
        href: 'https://www.youtube.com/channel/UCt4l9CHZA6XUYw95dmzoLqQ',
        name: 'Youtube',
    },
    {
        icon: FaTiktok,
        href: 'https://www.tiktok.com/@pnl_manunggal',
        name: 'Tiktok',
    },
];

export function PublicFooter({ settings = {} }) {
    return (
        <footer className="bg-green-700 text-white">
            <div className="container mx-auto max-w-7xl px-6 py-16">
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
                                {/* Menggunakan FaMapPin dari react-icons */}
                                <FaMapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-green-100">
                                    {settings?.contact_address ||
                                        'Alamat belum diatur.'}
                                </span>
                            </li>
                            <li className="flex items-center">
                                {/* Menggunakan FaPhone dari react-icons */}
                                <FaPhone className="h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-green-100">
                                    {settings?.contact_phone ||
                                        'Telepon belum diatur.'}
                                </span>
                            </li>
                            <li className="flex items-center">
                                {/* Menggunakan FaEnvelope dari react-icons */}
                                <FaEnvelope className="h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 text-sm text-green-100">
                                    {settings?.contact_email ||
                                        'Email belum diatur.'}
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

                        {/* 3. Tautan media sosial tanpa latar belakang berwarna */}
                        <div className="mt-6 flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    // Ikon akan langsung berwarna putih dari text-white parent
                                    className="text-green-100 transition-opacity hover:opacity-80"
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
                    &copy; {new Date().getFullYear()} Politeknik Negeri
                    Lhokseumawe - All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
