import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRight, CalendarDays, GalleryHorizontal } from 'lucide-react';

// Helper
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

// ## KOMPONEN KARTU PROGRAM DENGAN DESAIN BARU ##
const ProgramCard = ({ program }) => (
    <Link
        href={`/galeri/${program.id}`}
        className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
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
                    {format(new Date(program.program_date), 'dd MMMM yyyy', {
                        locale: id,
                    })}
                </p>
            </div>
        </div>
        <div className="p-6">
            <h3 className="line-clamp-2 h-14 text-xl font-bold text-gray-800 transition-colors group-hover:text-green-700">
                {program.name}
            </h3>
            <p className="mt-2 line-clamp-3 h-[60px] text-sm leading-relaxed text-gray-600">
                {program.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div>
                    <p className="text-xs text-muted-foreground">
                        Dana Tersalurkan
                    </p>
                    <p className="text-xl font-bold text-green-700">
                        {formatCurrency(program.penyalurans_sum_amount)}
                    </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-green-600 group-hover:text-white">
                    <ArrowRight className="h-5 w-5" />
                </div>
            </div>
        </div>
    </Link>
);

export default function Index({ programs }) {
    return (
        <PublicLayout>
            <Head title="Galeri Program" />

            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Galeri Program
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Jelajahi setiap langkah dan dampak nyata dari
                        program-program penyaluran kami.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-7xl px-4">
                    {programs.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {programs.data.map((program) => (
                                    <ProgramCard
                                        key={program.id}
                                        program={program}
                                    />
                                ))}
                            </div>
                            <div className="mt-16 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        {programs.links.map((link, index) =>
                                            link.label.includes('Previous') ? (
                                                <PaginationPrevious
                                                    key={index}
                                                    href={link.url}
                                                />
                                            ) : link.label.includes('Next') ? (
                                                <PaginationNext
                                                    key={index}
                                                    href={link.url}
                                                />
                                            ) : (
                                                <PaginationLink
                                                    key={index}
                                                    href={link.url}
                                                    isActive={link.active}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ),
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white p-8 py-20 text-center shadow-lg">
                            <GalleryHorizontal className="h-24 w-24 text-gray-300" />
                            <h3 className="text-3xl font-bold text-gray-800">
                                Oops! Belum Ada Program Tersedia
                            </h3>
                            <p className="max-w-md text-lg text-muted-foreground">
                                Sepertinya belum ada program yang dipublikasikan
                                saat ini. Mohon kembali lagi nanti atau hubungi
                                kami untuk informasi lebih lanjut.
                            </p>
                            <Link href="/">
                                <Button className="mt-4 px-6 py-3 text-base font-medium">
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
