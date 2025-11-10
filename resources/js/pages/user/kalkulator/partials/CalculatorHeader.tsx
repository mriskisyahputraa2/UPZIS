import React from 'react';

/**
 * Komponen untuk menampilkan header utama halaman Kalkulator Zakat.
 *
 * @returns {JSX.Element}
 */
const CalculatorHeader = () => {
    return (
        <section className="bg-green-700 pt-32 pb-24 text-white">
            <div className="container mx-auto max-w-4xl px-4 text-center">
                <h1 className="text-4xl font-bold md:text-5xl">
                    Kalkulator Zakat
                </h1>
                <p className="mt-4 text-lg text-green-100">
                    Hitung kewajiban zakat maal Anda dengan mudah, akurat, dan
                    transparan.
                </p>
            </div>
        </section>
    );
};

export default CalculatorHeader;
