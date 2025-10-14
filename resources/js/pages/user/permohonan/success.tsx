import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import { Check, CheckCircle, Copy, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { toast, Toaster } from 'sonner';

export default function Success({ unique_code }) {
    const [isCopied, setIsCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const copyToClipboard = () => {
        if (!unique_code) return;
        navigator.clipboard.writeText(unique_code);
        toast.success('Kode pendaftaran berhasil disalin!');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <PublicLayout>
            <Head title="Pendaftaran Berhasil" />
            <Toaster richColors position="bottom-right" />
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            <section className="bg-green-700 pt-32 pb-16 text-white">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <CheckCircle className="mx-auto h-16 w-16" />
                    <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                        Pendaftaran Berhasil!
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Satu langkah lebih dekat untuk mendapatkan bantuan.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="text-center shadow-lg duration-700 animate-in fade-in slide-in-from-bottom-5">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Simpan Kode Pendaftaran Anda
                            </CardTitle>
                            <p className="pt-2 text-muted-foreground">
                                Kode ini SANGAT PENTING untuk melacak status
                                permohonan Anda. Mohon catat atau simpan di
                                tempat yang aman.
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="my-6 w-full max-w-md rounded-lg border-2 border-dashed bg-gray-50/80 p-4 sm:p-6">
                                <p className="text-base font-semibold text-muted-foreground">
                                    Kode Unik Anda:
                                </p>
                                <p className="mt-2 text-3xl font-extrabold tracking-wider break-all text-primary sm:text-4xl">
                                    {unique_code}
                                </p>
                            </div>
                            <Button
                                size="lg"
                                onClick={copyToClipboard}
                                className="w-full max-w-md text-base font-bold"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />{' '}
                                        Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-5 w-5" /> Salin
                                        Kode
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                        <h3 className="text-xl font-bold">
                            Langkah Selanjutnya
                        </h3>
                        <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={`/lacak-status?kode=${unique_code}`}>
                                {' '}
                                {/* Ganti dengan rute Cek Status nanti */}
                                <Button
                                    className="w-full text-base font-bold"
                                    size="lg"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Lacak Status Permohonan
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="w-full text-base font-bold"
                                    size="lg"
                                >
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
