import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight, HandHeart } from 'lucide-react';

export default function CallToAction() {
    return (
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
    );
}
