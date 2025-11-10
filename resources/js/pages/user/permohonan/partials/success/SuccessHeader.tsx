import { CheckCircle } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} SuccessHeaderProps
 * @property {string} title - Judul utama header.
 * @property {string} description - Deskripsi singkat di bawah judul.
 */

/**
 * Komponen header untuk halaman sukses pendaftaran.
 * Menampilkan ikon centang, judul, dan deskripsi.
 *
 * @param {SuccessHeaderProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const SuccessHeader = ({ title, description }) => {
    return (
        <section className="bg-green-700 pt-32 pb-16 text-white">
            <div className="container mx-auto max-w-4xl px-4 text-center">
                <CheckCircle className="mx-auto h-16 w-16" />
                <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                    {title}
                </h1>
                <p className="mt-4 text-lg text-green-100">{description}</p>
            </div>
        </section>
    );
};

export default SuccessHeader;
