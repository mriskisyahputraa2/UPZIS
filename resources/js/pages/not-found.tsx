import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

// PENTING: Sesuaikan path ke logo Anda
import BrandLogo from '../../assets/images/logo-pnl.png';

export default function NotFoundPage() {
    return (
        <>
            <Head title="404: Halaman Tidak Ditemukan" />

            <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-green-50 p-6 dark:bg-gray-900">
                {/* --- Latar Belakang Mesh Gradient --- */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-green-300 opacity-50 blur-3xl filter" />
                    <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-teal-200 opacity-50 blur-3xl filter" />
                    <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-lime-200 opacity-50 blur-3xl filter" />
                </div>
                {/* --- Selesai Latar Belakang --- */}

                {/* Kontainer utama untuk konten */}
                <div className="relative z-10 w-full max-w-lg text-center">
                    {/* Logo */}
                    <img
                        className="mx-auto h-40 w-auto drop-shadow-xl md:h-48"
                        src={BrandLogo}
                        alt="Logo UPZIS Politeknik Negeri Lhokseumawe"
                    />

                    <p className="mt-8 font-semibold text-green-700 dark:text-green-400">
                        ERROR 404
                    </p>

                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                        Halaman Tidak Ditemukan
                    </h1>

                    <p className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Maaf, sepertinya halaman yang Anda cari telah berpindah
                        atau tidak pernah ada.
                    </p>

                    <div className="mt-10">
                        <Link href="/">
                            <Button
                                size="lg"
                                className="bg-green-600 px-8 py-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-xl active:scale-100"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
