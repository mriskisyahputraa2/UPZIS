import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { GalleryHorizontal } from 'lucide-react';

export default function NoProgramsFound() {
    return (
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
    );
}
