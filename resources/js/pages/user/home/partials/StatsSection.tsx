import { motion } from 'framer-motion';
import {
    Calculator,
    GalleryHorizontal,
    UserCheck,
    Users,
} from 'lucide-react';
import { containerVariants, itemVariants } from '../helpers';

export default function StatsSection({ muzakkiCount, mustahikCount }) {
    return (
        <section className="relative z-20 -mt-20 mb-20">
            <div className="container mx-auto max-w-7xl px-6">
                <motion.div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div
                        variants={itemVariants}
                        className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                    >
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium text-gray-500">
                                    Muzakki Berdonasi
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {muzakkiCount}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                    >
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium text-gray-500">
                                    Mustahik Terbantu
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {mustahikCount}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.a
                        href="/kalkulator-zakat"
                        variants={itemVariants}
                        className="block rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                    >
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <Calculator className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium text-gray-500">
                                    Hitung Kewajiban
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    Kalkulator Zakat
                                </p>
                            </div>
                        </div>
                    </motion.a>
                    <motion.a
                        href="/galeri"
                        variants={itemVariants}
                        className="block rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                    >
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <GalleryHorizontal className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium text-gray-500">
                                    Lihat Laporan
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    Galeri Program
                                </p>
                            </div>
                        </div>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
