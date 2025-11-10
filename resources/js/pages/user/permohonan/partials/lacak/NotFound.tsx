import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import React from 'react';

/**
 * Komponen yang ditampilkan ketika data permohonan tidak ditemukan setelah pencarian.
 *
 * @returns {JSX.Element}
 */
const NotFound = () => {
    return (
        <Card className="duration-500 animate-in fade-in">
            <CardContent className="p-10 text-center">
                <HelpCircle className="mx-auto h-16 w-16 text-gray-400" />
                <h2 className="mt-4 text-2xl font-bold">
                    Data Tidak Ditemukan
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Pastikan kode atau data diri yang Anda masukkan sudah
                    benar.
                </p>
            </CardContent>
        </Card>
    );
};

export default NotFound;
