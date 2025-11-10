import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { containerVariants } from '../helpers';
import ProgramCard from './ProgramCard';

export default function GaleriProgramSection({ programs }) {
    return (
        <section className="bg-gray-50 py-24">
            <div className="container mx-auto max-w-7xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                        Transparansi Program Kami
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                        Lihat bagaimana setiap donasi Anda diubah menjadi
                        program nyata yang memberikan manfaat luas bagi
                        sesama.
                    </p>
                </motion.div>

                {programs.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {programs.map((program) => (
                            <ProgramCard
                                key={program.id}
                                program={program}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="mt-12 rounded-lg border bg-white py-16 text-center">
                        <p className="text-muted-foreground">
                            Belum ada program yang dipublikasikan saat ini.
                        </p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12"
                >
                    <Link
                        href="/galeri"
                        className="inline-flex transform items-center rounded-lg bg-green-600 px-8 py-3 text-center font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
                    >
                        Lihat Semua Program{' '}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
