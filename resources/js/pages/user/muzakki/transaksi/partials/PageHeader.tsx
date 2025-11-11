/**
 * @file PageHeader.tsx
 * @description Komponen header (hero section) standar untuk halaman-halaman transaksi.
 * Menampilkan judul besar dan deskripsi di dalam sebuah section dengan latar belakang hijau.
 *
 * @component PageHeader
 * @param {object} props - Properti komponen.
 * @param {string} props.title - Judul utama yang akan ditampilkan.
 * @param {string} props.description - Teks deskripsi di bawah judul.
 * @returns {JSX.Element} Komponen header halaman.
 */
import React from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
    return (
        <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
            <div className="container mx-auto max-w-4xl px-6 text-center">
                <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
                <p className="mt-4 text-lg text-green-100">{description}</p>
            </div>
        </section>
    );
};

export default PageHeader;
