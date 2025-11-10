import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} UniqueCodeCardProps
 * @property {string} unique_code - Kode pendaftaran unik.
 * @property {() => void} copyToClipboard - Fungsi untuk menyalin kode ke clipboard.
 * @property {boolean} isCopied - Status apakah kode sudah tersalin.
 */

/**
 * Komponen kartu untuk menampilkan kode pendaftaran unik.
 * Termasuk tombol untuk menyalin kode tersebut.
 *
 * @param {UniqueCodeCardProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const UniqueCodeCard = ({ unique_code, copyToClipboard, isCopied }) => {
    return (
        <Card className="text-center shadow-lg duration-700 animate-in fade-in slide-in-from-bottom-5">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Simpan Kode Pendaftaran Anda
                </CardTitle>
                <p className="pt-2 text-muted-foreground">
                    Kode ini SANGAT PENTING untuk melacak status permohonan
                    Anda. Mohon catat atau simpan di tempat yang aman.
                </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="my-6 w-full max-w-md rounded-lg border-2 border-dashed bg-gray-50/80 p-4 sm:p-6">
                    <p className="text-base font-semibold text-muted-foreground">
                        Kode Unik Anda:
                    </p>
                    <p className="mt-2 break-all text-3xl font-extrabold tracking-wider text-primary sm:text-4xl">
                        {unique_code}
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={copyToClipboard}
                    className="w-full max-w-md text-base font-bold"
                >
                    {isCopied ? (
                        <>
                            <Check className="mr-2 h-5 w-5" /> Tersalin!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-5 w-5" /> Salin Kode
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

export default UniqueCodeCard;
