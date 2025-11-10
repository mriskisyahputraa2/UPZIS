import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

export default function ProgramDetails({ program }) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true }),
    );

    return (
        <article className="space-y-8 lg:col-span-2">
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
    );
}
