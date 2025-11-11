/**
 * @file DonationTypeCard.tsx
 * @description Komponen kartu untuk menampilkan satu jenis pilihan donasi.
 * Komponen ini dapat diklik dan akan mengarahkan pengguna ke halaman yang sesuai.
 *
 * @component DonationTypeCard
 * @param {object} props - Properti komponen.
 * @param {React.ElementType} props.icon - Komponen ikon yang akan ditampilkan.
 * @param {string} props.name - Nama jenis donasi (misal: "Zakat", "Infaq").
 * @param {string} props.description - Deskripsi singkat tentang jenis donasi.
 * @param {string} props.href - URL tujuan ketika kartu diklik.
 * @returns {JSX.Element} Komponen kartu jenis donasi.
 */
import { Link } from '@inertiajs/react';
import React from 'react';

interface DonationTypeCardProps {
    icon: React.ElementType;
    name: string;
    description: string;
    href: string;
}

const DonationTypeCard: React.FC<DonationTypeCardProps> = ({
    icon: Icon,
    name,
    description,
    href,
}) => {
    return (
        <Link
            href={href}
            className="group block transform rounded-xl border bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
            <Icon className="mx-auto h-12 w-12 text-green-600 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="mt-4 text-2xl font-bold text-gray-800">{name}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
        </Link>
    );
};

export default DonationTypeCard;
