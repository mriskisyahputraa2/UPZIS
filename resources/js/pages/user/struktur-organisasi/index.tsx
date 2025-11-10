import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import { ZoomIn } from 'lucide-react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export default function StrukturOrganisasiPage({ dataStruktur }) {
    const [openLightbox, setOpenLightbox] = useState(false);

    const slides = dataStruktur?.gambar_url
        ? [{ src: dataStruktur.gambar_url }]
        : [];

    return (
        <PublicLayout>
            <Head title="Struktur Organisasi" />

            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Struktur Organisasi
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Susunan pengurus Unit Pengumpul Zakat, Infaq, dan
                        Sedekah Politeknik Negeri Lhokseumawe.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-4xl px-4">
                    {dataStruktur?.gambar_url ? (
                        <div className="space-y-8">
                            <Card className="overflow-hidden shadow-xl">
                                <CardContent className="p-0">
                                    <button
                                        type="button"
                                        onClick={() => setOpenLightbox(true)}
                                        className="group relative block w-full cursor-zoom-in"
                                        aria-label="Perbesar gambar struktur organisasi"
                                    >
                                        <img
                                            src={dataStruktur.gambar_url}
                                            alt="Struktur Organisasi UPZIS"
                                            className="h-auto w-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <ZoomIn className="h-16 w-16 text-white" />
                                        </div>
                                    </button>
                                </CardContent>
                            </Card>

                            {dataStruktur.keterangan && (
                                <Card className="shadow-xl">
                                    <CardHeader>
                                        <CardTitle>
                                            Keterangan Struktur Organisasi
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose max-w-none text-lg leading-relaxed text-gray-700">
                                        <p className="whitespace-pre-wrap">
                                            {dataStruktur.keterangan}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <Card className="shadow-xl">
                            <CardContent className="p-12 text-center">
                                <p className="text-muted-foreground">
                                    Informasi struktur organisasi belum
                                    tersedia.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={slides}
                plugins={[Zoom, Fullscreen]}
                styles={{
                    container: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                    },
                }}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
            />
        </PublicLayout>
    );
}
