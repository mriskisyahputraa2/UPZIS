import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import React from 'react';

/**
 * Komponen yang ditampilkan ketika periode pendaftaran bantuan sedang ditutup.
 *
 * @returns {JSX.Element}
 */
const RegistrationClosed = () => {
    return (
        <Card className="shadow-lg duration-500 animate-in fade-in">
            <CardContent className="flex flex-col items-center p-10 text-center">
                <AlertTriangle className="h-20 w-20 text-yellow-500" />
                <h2 className="mt-6 text-3xl font-bold">
                    Pendaftaran Saat Ini Ditutup
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                    Mohon maaf, periode pendaftaran bantuan belum dibuka.
                    Pantau terus informasi dari kami untuk jadwal pendaftaran
                    berikutnya.
                </p>
                <Link href="/">
                    <Button
                        className="mt-8 text-base font-bold"
                        size="lg"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Beranda
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default RegistrationClosed;
