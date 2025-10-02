import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Calculator,
    HandHeart,
    ListChecks,
    MessageSquareQuote,
    Search,
    UserCheck,
    Users,
} from 'lucide-react';

import heroLogo from '../../../../assets/images/hero.png';

// Terima props dari controller
export default function Homepage({ muzakkiCount, mustahikCount }) {
    // Konfigurasi untuk animasi stagger (elemen muncul satu per satu)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    // Data statis untuk Galeri Program (ganti dengan data asli nanti)
    const programItems = [
        {
            image: heroLogo,
            title: 'Bantuan UKT Mahasiswa 2024',
            description:
                'Penyaluran dana zakat untuk membantu biaya Uang Kuliah Tunggal bagi mahasiswa semester akhir yang membutuhkan.',
            amount: 'Rp 25.000.000',
        },
        {
            image: heroLogo,
            title: 'Santunan Anak Yatim Piatu',
            description:
                'Program santunan dan pemberian paket sembako untuk anak-anak yatim piatu di lingkungan sekitar kampus.',
            amount: 'Rp 15.000.000',
        },
        {
            image: heroLogo,
            title: 'Modal Usaha Mikro (UMKM)',
            description:
                'Pemberian modal usaha produktif bagi para pedagang kecil untuk membantu meningkatkan perekonomian keluarga.',
            amount: 'Rp 20.000.000',
        },
    ];

    // Data statis untuk Testimoni
    const testimonials = [
        {
            name: 'Ahmad Maulana',
            role: 'Penerima Manfaat 2024',
            quote: 'Alhamdulillah, bantuan dari UPZIS sangat membantu meringankan biaya kuliah saya di semester akhir. Prosesnya cepat dan transparan. Terima kasih banyak.',
        },
        {
            name: 'Siti Fatimah',
            role: 'Muzakki',
            quote: 'Saya merasa amanah dan percaya menyalurkan zakat saya di sini. Laporan penyalurannya jelas dan saya bisa melihat langsung program-program yang berjalan.',
        },
        {
            name: 'Budi Santoso',
            role: 'Penerima Manfaat 2024',
            quote: 'Terima kasih kepada para donatur dan pengurus UPZIS. Bantuan ini memberikan harapan baru bagi saya untuk menyelesaikan studi tepat waktu.',
        },
    ];

    // Data statis untuk FAQ
    const faqs = [
        {
            q: 'Bagaimana cara membayar zakat di platform ini?',
            a: 'Anda bisa mendaftar sebagai Muzakki, kemudian masuk ke dashboard Anda dan memilih menu Bayar Zakat. Kami menyediakan berbagai metode pembayaran online yang aman dan terverifikasi otomatis.',
        },
        {
            q: 'Siapa saja yang berhak menerima bantuan?',
            a: 'Sesuai prioritas kami, penerima bantuan saat ini adalah mahasiswa aktif semester akhir di sekitar lingkungan kampus yang memenuhi kriteria tidak mampu dan tidak sedang menerima beasiswa lain.',
        },
        {
            q: 'Apakah data saya aman?',
            a: 'Kami sangat menjaga kerahasiaan data pribadi Anda. Data hanya digunakan untuk keperluan verifikasi internal dan tidak akan dibagikan kepada pihak luar tanpa izin Anda.',
        },
        {
            q: 'Bagaimana saya tahu dana saya sudah tersalurkan?',
            a: 'Kami menyediakan halaman Galeri Program di mana kami secara rutin mempublikasikan laporan dan dokumentasi dari setiap program penyaluran yang telah kami laksanakan sebagai bentuk transparansi.',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Beranda" />

            {/* 1. Hero Section */}
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
                            <h1
                                className="text-4xl leading-tight font-extrabold tracking-tight md:text-6xl"
                                style={{
                                    textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                                }}
                            >
                                Sistem Informasi Zakat
                            </h1>
                            <p className="mx-auto mt-6 max-w-xl text-lg text-green-100 lg:mx-0">
                                Memfasilitasi penghimpunan dan penyaluran zakat
                                secara efektif, transparan, dan amanah.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                <Link
                                    href="/bayar-zakat"
                                    className="inline-block rounded-lg bg-white px-8 py-3 text-center font-bold text-green-700 transition duration-300 hover:bg-gray-200 hover:shadow-lg"
                                >
                                    Bayar Zakat Sekarang
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
                                alt="Ilustrasi Masjid"
                                className="h-auto w-full max-w-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Stats Section */}
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
                                        Muzakki Terdaftar
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
                            href="/kalkulator"
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
                                    <BarChart3 className="h-6 w-6 text-green-600" />
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

            {/* 3. Layanan Section */}
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
                        {/* Kartu Untuk Muzakki */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/bayar-zakat"
                                className="block h-full transform rounded-xl border-t-4 border-green-500 bg-white p-8 text-left shadow-lg transition-shadow duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="inline-block rounded-full bg-green-100 p-4">
                                    <HandHeart className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-gray-800">
                                    Untuk Muzakki
                                </h3>
                                <p className="mt-2 text-slate-600">
                                    Hitung dan tunaikan zakat Anda dengan mudah
                                    melalui pembayaran yang aman dan
                                    terverifikasi otomatis.
                                </p>
                            </Link>
                        </motion.div>

                        {/* Kartu Untuk Mustahik */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/ajukan-bantuan"
                                className="block h-full transform rounded-xl border-t-4 border-green-500 bg-white p-8 text-left shadow-lg transition-shadow duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
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

                        {/* ## TAMBAHKAN KARTU BARU INI ## */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/lacak-status"
                                className="block h-full transform rounded-xl border-t-4 border-green-500 bg-white p-8 text-left shadow-lg transition-shadow duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="inline-block rounded-full bg-green-100 p-4">
                                    <Search className="h-8 w-8 text-green-600" />{' '}
                                    {/* Menggunakan ikon Search */}
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

            {/* 4. Seksi Testimoni */}
            <section className="bg-green-50 py-24">
                <div className="container mx-auto max-w-7xl px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold text-gray-800"
                    >
                        Apa Kata Mereka?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-slate-600"
                    >
                        Kisah nyata dari para donatur yang percaya dan para
                        penerima manfaat yang telah merasakan kebaikan Anda.
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="rounded-xl bg-white p-8 text-left shadow-lg"
                            >
                                <MessageSquareQuote className="h-8 w-8 text-green-500" />
                                <p className="mt-4 text-slate-600 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="mt-6">
                                    <p className="font-bold text-gray-800">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 5. Seksi Galeri Program (PREVIEW) */}
            <section className="bg-white py-24">
                <div className="container mx-auto max-w-7xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800">
                            Transparansi Program Kami
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                            Lihat bagaimana setiap donasi Anda diubah menjadi
                            program nyata yang memberikan manfaat luas bagi
                            sesama.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {programItems.map((program, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group overflow-hidden rounded-xl bg-white text-left shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {program.title}
                                    </h3>
                                    <p className="mt-2 h-24 text-slate-600">
                                        {program.description}
                                    </p>
                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-sm text-slate-500">
                                            Dana Tersalurkan
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            {program.amount}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
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
                            Lihat Semua Program
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 6. Seksi FAQ */}
            <section className="bg-green-50 py-24">
                <div className="container mx-auto max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-800">
                            Pertanyaan Umum
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                            Menemukan jawaban cepat untuk pertanyaan paling umum
                            tentang proses di platform kami.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12"
                    >
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index + 1}`}
                                    className="border-green-200"
                                >
                                    <AccordionTrigger className="text-left text-lg font-semibold text-green-800 hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-base text-slate-600">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </section>

            {/* 7. Seksi Final Call to Action */}
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
                        Salurkan zakat Anda atau ajukan permohonan bantuan
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
                            href="/bayar-zakat"
                            className="inline-block transform rounded-lg bg-green-600 px-8 py-3 text-center font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
                        >
                            Bayar Zakat Sekarang
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
        </PublicLayout>
    );
}
