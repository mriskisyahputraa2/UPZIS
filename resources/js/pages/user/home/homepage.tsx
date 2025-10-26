import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calculator,
    CalendarDays,
    GalleryHorizontal,
    HandHeart,
    ListChecks,
    Search,
    UserCheck,
    Users,
} from 'lucide-react';

import heroLogo from '../../../../assets/images/hero.png';

// Helper
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

// Komponen Kartu Program (desain level maksimal)
const ProgramCard = ({ program }) => (
    <motion.div variants={itemVariants} className="h-full">
        <Link
            href={`/galeri/${program.id}`}
            className="group block flex h-full flex-col overflow-hidden rounded-xl bg-white text-left shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={
                        program.photos.length > 0
                            ? `/storage/${program.photos[0].photo_path}`
                            : 'https://via.placeholder.com/600x338?text=Dokumentasi+Program'
                    }
                    alt={program.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute right-4 bottom-4 left-4 text-white">
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="h-4 w-4" />
                        {format(
                            new Date(program.program_date),
                            'dd MMMM yyyy',
                            { locale: id },
                        )}
                    </p>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="line-clamp-2 h-14 text-xl font-bold text-gray-800 transition-colors group-hover:text-green-700">
                    {program.name}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {program.description}
                </p>
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-slate-500">Dana Tersalurkan</p>
                    <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(program.penyalurans_sum_amount)}
                    </p>
                </div>
            </div>
        </Link>
    </motion.div>
);

export default function Homepage({ muzakkiCount, mustahikCount, programs }) {
    // Data statis untuk Testimoni dan FAQ
    const testimonials = [
        {
            name: 'Ahmad Maulana',
            role: 'Penerima Manfaat 2024',
            quote: 'Alhamdulillah, bantuan dari UPZIS sangat membantu meringankan biaya kuliah saya di semester akhir. Prosesnya cepat dan transparan. Terima kasih banyak.',
        },
        {
            name: 'Siti Fatimah',
            role: 'Muzakki',
            quote: 'Saya merasa amanah dan percaya menyalurkan donasi saya di sini. Laporan penyalurannya jelas dan saya bisa melihat langsung program-program yang berjalan.',
        },
        {
            name: 'Budi Santoso',
            role: 'Penerima Manfaat 2024',
            quote: 'Terima kasih kepada para donatur dan pengurus UPZIS. Bantuan ini memberikan harapan baru bagi saya untuk menyelesaikan studi tepat waktu.',
        },
    ];

    const faqs = [
        {
            q: 'Bagaimana cara berdonasi di platform ini?',
            a: 'Anda bisa mendaftar atau login, kemudian pilih menu Donasi. Kami menyediakan metode pembayaran yang mudah untuk Zakat, Infaq, dan Sedekah, melalui DANA & GoPay dan pembayaran tunai secara langsung.',
        },
        {
            q: 'Siapa saja yang berhak menerima bantuan?',
            a: 'Sesuai prioritas kami, penerima bantuan terbagi menjadi dua kategori utama: Mahasiswa (dengan kriteria aktif semester akhir, kurang mampu, dan tidak sedang menerima beasiswa lain) serta masyarakat umum yang termasuk dalam kategori fakir/miskin.',
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
                            <div
                                style={{
                                    textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                                }}
                            >
                                <h1 className="text-5xl leading-tight font-extrabold tracking-tight md:text-6xl">
                                    Unit Pengumpul Zakat, Infaq dan Sedekah
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

            {/* 5. Seksi Galeri Program (PREVIEW) */}
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

            {/* ## 6. SEKSI FAQ (DITAMBAHKAN KEMBALI) ## */}
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
        </PublicLayout>
    );
}
