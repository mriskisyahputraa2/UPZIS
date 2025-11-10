import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import heroLogo from '../../../../../assets/images/hero.png';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 pt-36 pb-32 text-white">
            <div className="absolute inset-0 bg-[url('/images/islamic-pattern.svg')] opacity-10"></div>
            <div className="relative z-10 container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <div
                            style={{
                                textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                            }}
                        >
                            <h1 className="text-5xl leading-tight font-extrabold tracking-tight md:text-6xl">
                                Unit Pengumpul Zakat, Infaq, dan Sedekah
                            </h1>
                            <p className="mt-4 max-w-2xl text-xl font-medium text-green-100 lg:text-2xl">
                                Politeknik Negeri Lhokseumawe
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                            <Link
                                href="/donasi"
                                className="inline-block rounded-lg bg-white px-8 py-3 text-center font-bold text-green-700 transition duration-300 hover:bg-gray-200 hover:shadow-lg"
                            >
                                Donasi Sekarang
                            </Link>
                            <Link
                                href="/ajukan-bantuan"
                                className="inline-block rounded-lg border-2 border-white px-8 py-3 text-center font-bold text-white transition duration-300 hover:bg-white hover:text-green-700"
                            >
                                Ajukan Bantuan
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden items-center justify-center lg:flex"
                    >
                        <img
                            src={heroLogo}
                            alt="Ilustrasi Zakat"
                            className="h-auto w-full max-w-lg"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
