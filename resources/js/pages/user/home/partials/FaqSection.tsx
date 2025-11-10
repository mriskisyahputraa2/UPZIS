import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

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

export default function FaqSection() {
    return (
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
    );
}
