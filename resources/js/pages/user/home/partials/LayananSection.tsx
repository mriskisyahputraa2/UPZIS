import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, HandHeart, ListChecks, Search } from 'lucide-react';
import { containerVariants, itemVariants } from '../helpers';

export default function LayananSection() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto max-w-5xl px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-gray-800"
                >
                    Salurkan Kebaikan, Dapatkan Kemudahan
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto mt-4 max-w-2xl text-slate-600"
                >
                    Platform kami hadir untuk menjembatani niat baik Anda
                    dengan mereka yang membutuhkan, melalui proses yang
                    mudah dan terpercaya.
                </motion.p>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/donasi"
                            className="group relative block h-full transform rounded-xl border-t-4 border-green-500 bg-white p-8 text-left shadow-lg transition-shadow duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="absolute top-8 right-8 opacity-50 transition-opacity duration-300 group-hover:opacity-100">
                                <ArrowRight className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="inline-block rounded-full bg-green-100 p-4">
                                <HandHeart className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-gray-800">
                                Salurkan Donasi
                            </h3>
                            <p className="mt-2 text-slate-600">
                                Tunaikan Zakat, Infaq, dan Sedekah Anda
                                dengan mudah melalui pembayaran yang aman
                                dan terverifikasi.
                            </p>
                        </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/ajukan-bantuan"
                            className="group relative block h-full transform rounded-xl border-t-4 border-green-500 bg-white p-8 text-left shadow-lg transition-shadow duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="absolute top-8 right-8 opacity-50 transition-opacity duration-300 group-hover:opacity-100">
                                <ArrowRight className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="inline-block rounded-full bg-green-100 p-4">
                                <ListChecks className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-gray-800">
                                Ajukan Bantuan
                            </h3>
                            <p className="mt-2 text-slate-600">
                                Ajukan permohonan bantuan zakat secara
                                online. Proses yang adil, transparan, dan
                                mudah diikuti.
                            </p>
                        </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/lacak-status"
                            className="group relative block h-full transform rounded-xl border-t-4 border-green-500 bg-white p-8 text-left shadow-lg transition-shadow duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="absolute top-8 right-8 opacity-50 transition-opacity duration-300 group-hover:opacity-100">
                                <ArrowRight className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="inline-block rounded-full bg-green-100 p-4">
                                <Search className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-gray-800">
                                Lacak Status
                            </h3>
                            <p className="mt-2 text-slate-600">
                                Sudah mendaftar? Periksa status progres
                                permohonan bantuan Anda di sini menggunakan
                                kode unik.
                            </p>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
