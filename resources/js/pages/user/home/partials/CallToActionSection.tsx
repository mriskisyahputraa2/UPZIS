import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function CallToActionSection() {
    return (
        <section className="border-t border-gray-100 bg-white py-20">
            <div className="container mx-auto max-w-7xl px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-extrabold text-gray-800"
                >
                    Siap Menjadi Bagian dari Kebaikan?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
                >
                    Salurkan donasi Anda atau ajukan permohonan bantuan
                    melalui platform kami sekarang juga.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
                >
                    <Link
                        href="/donasi"
                        className="inline-block transform rounded-lg bg-green-600 px-8 py-3 text-center font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
                    >
                        Donasi Sekarang
                    </Link>
                    <Link
                        href="/ajukan-bantuan"
                        className="inline-block transform rounded-lg border-2 border-green-600 px-8 py-3 text-center font-bold text-green-600 transition duration-300 hover:-translate-y-1 hover:bg-green-600 hover:text-white"
                    >
                        Ajukan Bantuan
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
