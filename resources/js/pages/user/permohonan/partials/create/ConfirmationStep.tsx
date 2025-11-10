import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} ConfirmationStepProps
 * @property {boolean} processing - Status apakah form sedang dalam proses pengiriman.
 */

/**
 * Komponen untuk langkah keempat formulir: konfirmasi dan pengiriman.
 * Berisi tombol submit akhir.
 *
 * @param {ConfirmationStepProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const ConfirmationStep = ({ processing }) => {
    return (
        <Card className="shadow-lg delay-300 duration-500 animate-in fade-in slide-in-from-bottom-5">
            <CardHeader>
                <CardTitle className="flex items-center gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                        4
                    </span>
                    <span className="text-xl">Konfirmasi & Kirim</span>
                </CardTitle>
                <CardDescription className="pt-1 pl-12">
                    Periksa kembali data Anda. Pastikan semua informasi dan
                    dokumen sudah benar sebelum mengirim.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-12">
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={processing}
                        className="text-base font-bold"
                    >
                        <Check className="mr-2 h-5 w-5" />
                        {processing
                            ? 'Mengirim Data...'
                            : 'Saya Setuju & Kirim Pengajuan'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ConfirmationStep;
