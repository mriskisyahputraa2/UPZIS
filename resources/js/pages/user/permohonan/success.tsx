import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { toast, Toaster } from 'sonner';
import NextSteps from './partials/success/NextSteps';
import SuccessHeader from './partials/success/SuccessHeader';
import UniqueCodeCard from './partials/success/UniqueCodeCard';

/**
 * Halaman yang ditampilkan setelah pengguna berhasil mengajukan permohonan.
 * Menampilkan pesan sukses, kode unik pendaftaran, dan langkah selanjutnya.
 *
 * @param {object} props - Properti halaman.
 * @param {string} props.unique_code - Kode pendaftaran unik yang dihasilkan.
 * @returns {JSX.Element}
 */
export default function Success({ unique_code }) {
    const [isCopied, setIsCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Efek untuk menampilkan confetti saat komponen dimuat
    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000); // Hentikan confetti setelah 5 detik
        return () => clearTimeout(timer);
    }, []);

    /**
     * Menyalin kode unik ke clipboard pengguna.
     */
    const copyToClipboard = () => {
        if (!unique_code) return;
        navigator.clipboard.writeText(unique_code);
        toast.success('Kode pendaftaran berhasil disalin!');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset status "Tersalin" setelah 2 detik
    };

    return (
        <PublicLayout>
            <Head title="Pendaftaran Berhasil" />
            <Toaster richColors position="bottom-right" />
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            <SuccessHeader
                title="Pendaftaran Berhasil!"
                description="Satu langkah lebih dekat untuk mendapatkan bantuan."
            />

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-2xl px-4">
                    <UniqueCodeCard
                        unique_code={unique_code}
                        copyToClipboard={copyToClipboard}
                        isCopied={isCopied}
                    />

                    <NextSteps unique_code={unique_code} />
                </div>
            </section>
        </PublicLayout>
    );
}