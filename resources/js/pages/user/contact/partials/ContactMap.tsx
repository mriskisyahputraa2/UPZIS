/**
 * @file ContactMap.tsx
 * @description Komponen untuk menampilkan peta lokasi menggunakan Google Maps.
 * Peta ini menunjukkan lokasi sekretariat.
 */

import React from 'react';

const ContactMap: React.FC = () => {
    return (
        <section>
            <div className="container mx-auto max-w-7xl px-4 text-center">
                <h2 className="mb-6 text-3xl font-bold">Lokasi Kami</h2>
            </div>
            <div className="h-[450px] w-full md:h-[550px]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.3620580528486!2d97.15578601037409!3d5.1206249948350235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304777a35c813bbf%3A0xfac9e2831347f07f!2sPoliteknik%20Negeri%20Lhokseumawe!5e1!3m2!1sid!2sid!4v1761149656715!5m2!1sid!2sid"
                    className="h-full w-full border-0"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </section>
    );
};

export default ContactMap;
