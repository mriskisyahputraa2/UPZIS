import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Autoplay from 'embla-carousel-autoplay';
import {
    ArrowRight,
    Banknote,
    CalendarDays,
    GalleryHorizontal,
    HandHeart,
    Info,
    Users,
} from 'lucide-react';
import React from 'react';

// Helper
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

// Komponen StatItem
const StatItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default function Show({ program }) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true }),
    );

    return (
        <PublicLayout>
            <Head title={program.name} />

            {/* 1. HEADER (Kembali ke desain header hijau solid) */}
            <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        {program.name}
                    </h1>
                </div>
            </section>

            {/* 2. KONTEN UTAMA (Tata letak 2 kolom) */}
            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                        {/* Kolom Kiri (Artikel Utama) - DIBUAT "TANPA KOTAK" */}
                        <article className="space-y-8 lg:col-span-2">
                            {/* Slider Foto (Tanpa Card wrapper) */}
                            {program.photos.length > 0 && (
                                <div className="overflow-hidden rounded-xl shadow-xl">
                                    {program.photos.length > 1 ? (
                                        <Carousel
                                            plugins={[plugin.current]}
                                            className="w-full"
                                            onMouseEnter={plugin.current.stop}
                                            onMouseLeave={plugin.current.reset}
                                            opts={{ loop: true }}
                                        >
                                            <CarouselContent>
                                                {program.photos.map((photo) => (
                                                    <CarouselItem
                                                        key={photo.id}
                                                    >
                                                        <div className="aspect-video w-full">
                                                            <img
                                                                src={`/storage/${photo.photo_path}`}
                                                                alt={
                                                                    photo.caption ||
                                                                    program.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-4" />
                                            <CarouselNext className="right-4" />
                                        </Carousel>
                                    ) : (
                                        <div className="aspect-video w-full">
                                            <img
                                                src={`/storage/${program.photos[0].photo_path}`}
                                                alt={program.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Deskripsi Program (Tanpa Card wrapper, tapi diberi background putih) */}
                            <div className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
                                <h2 className="mb-4 text-3xl font-bold text-gray-800">
                                    Tentang Program
                                </h2>
                                <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
                                    <p>
                                        {program.description ||
                                            'Deskripsi untuk program ini belum tersedia.'}
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Kolom Kanan (Sidebar Statistik "Sticky") - TETAP PAKAI CARD */}
                        <aside className="lg:col-span-1">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                <Card className="shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                                            <Info className="h-5 w-5 text-green-700" />
                                            Ringkasan Program
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <StatItem
                                            icon={CalendarDays}
                                            label="Tanggal Program"
                                            value={format(
                                                new Date(program.program_date),
                                                'dd MMMM yyyy',
                                                { locale: id },
                                            )}
                                        />
                                        <StatItem
                                            icon={Banknote}
                                            label="Total Dana Disalurkan"
                                            value={formatCurrency(
                                                program.penyalurans_sum_amount,
                                            )}
                                        />
                                        <StatItem
                                            icon={Users}
                                            label="Penerima Manfaat"
                                            value={`${program.penyalurans_count} Orang`}
                                        />
                                    </CardContent>
                                </Card>

                                <div className="rounded-xl bg-gray-50 p-6 text-center shadow-inner">
                                    <Link href="/galeri">
                                        <Button
                                            variant="outline"
                                            className="w-full bg-white shadow-sm"
                                        >
                                            <GalleryHorizontal className="mr-2 h-4 w-4" />
                                            Kembali ke Galeri
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* 3. Bagian Call to Action (Tetap sama) */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <HandHeart className="mx-auto h-12 w-12 text-green-600" />
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Dukung Program Kebaikan Lainnya
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                        Setiap donasi Anda adalah bahan bakar bagi kami untuk
                        terus menciptakan program-program bermanfaat seperti
                        ini.
                    </p>
                    <div className="mt-10">
                        <Link href="/donasi">
                            <Button
                                size="lg"
                                className="px-8 py-3 text-lg font-semibold"
                            >
                                Donasi Sekarang{' '}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
