import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    HandHeart,
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

const StatItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
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

            {/* ## PERUBAHAN 1: Replikasi Header dari Halaman Lacak Status ## */}
            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        {program.name}
                    </h1>
                    <p className="mt-4 flex items-center justify-center gap-2 text-lg text-green-100">
                        <CalendarDays className="h-5 w-5" />
                        <span>
                            Dilaksanakan pada{' '}
                            {format(
                                new Date(program.program_date),
                                'dd MMMM yyyy',
                                { locale: id },
                            )}
                        </span>
                    </p>
                </div>
            </section>

            {/* ## PERUBAHAN 2: Tambahkan margin negatif dan bungkus konten dalam satu Card ## */}
            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-4xl px-4">
                    <Card className="overflow-hidden shadow-lg">
                        {program.photos.length > 0 && (
                            <div className="bg-black">
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
                                                <CarouselItem key={photo.id}>
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

                        <CardContent className="space-y-12 p-6 sm:p-8">
                            <div className="prose max-w-none text-lg leading-relaxed text-gray-700">
                                <h2>Tentang Program</h2>
                                <p>
                                    {program.description ||
                                        'Deskripsi untuk program ini belum tersedia.'}
                                </p>
                            </div>

                            <div>
                                <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
                                    Ringkasan Dampak
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <StatItem
                                        icon={Banknote}
                                        label="Total Dana Disalurkan"
                                        value={formatCurrency(
                                            program.penyalurans_sum_amount,
                                        )}
                                    />
                                    <StatItem
                                        icon={Users}
                                        label="Jumlah Penerima Manfaat"
                                        value={`${program.penyalurans_count} Orang`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Bagian Call to Action */}
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
