/**
 * @file ContactHeader.tsx
 * @description Komponen untuk menampilkan header halaman kontak.
 * Komponen ini berisi judul utama dan subjudul untuk halaman "Hubungi Kami".
 */

import React from 'react';

const ContactHeader: React.FC = () => {
    return (
        <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
            <div className="container mx-auto max-w-4xl px-6 text-center">
                <h1 className="text-4xl font-bold md:text-5xl">
                    Hubungi Kami
                </h1>
                <p className="mt-4 text-lg text-green-100">
                    Punya pertanyaan atau masukan? Kami siap mendengarkan.
                </p>
            </div>
        </section>
    );
};

export default ContactHeader;