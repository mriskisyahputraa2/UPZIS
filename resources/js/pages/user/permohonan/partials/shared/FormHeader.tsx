import React from 'react';

/**
 * @typedef {object} FormHeaderProps
 * @property {string} title - Judul utama header.
 * @property {string} description - Deskripsi singkat di bawah judul.
 */

/**
 * Komponen header untuk halaman formulir.
 * Menampilkan judul dan deskripsi dalam sebuah section dengan latar belakang hijau.
 *
 * @param {FormHeaderProps} props - Properti untuk komponen FormHeader.
 * @returns {JSX.Element}
 */
const FormHeader = ({ title, description }) => {
    return (
        <section className="bg-green-700 pt-32 pb-16 text-white">
            <div className="container mx-auto max-w-4xl px-4 text-center">
                <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
                <p className="mt-4 text-lg text-green-100">{description}</p>
            </div>
        </section>
    );
};

export default FormHeader;
