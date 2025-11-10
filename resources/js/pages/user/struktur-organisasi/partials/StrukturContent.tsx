import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn } from 'lucide-react';

interface StrukturContentProps {
    dataStruktur: {
        gambar_url?: string;
        keterangan?: string;
    };
    onImageClick: () => void;
}

export default function StrukturContent({
    dataStruktur,
    onImageClick,
}: StrukturContentProps) {
    if (!dataStruktur?.gambar_url) {
        return (
            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-4xl px-4">
                    <Card className="shadow-xl">
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">
                                Informasi struktur organisasi belum tersedia.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        );
    }

    return (
        <section className="-mt-10 pb-16 md:pb-24">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="space-y-8">
                    <Card className="overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <button
                                type="button"
                                onClick={onImageClick}
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
            </div>
        </section>
    );
}
