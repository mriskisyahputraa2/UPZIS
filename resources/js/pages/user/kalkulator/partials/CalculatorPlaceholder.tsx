import { Separator } from '@/components/ui/separator';
import { Calculator, Loader } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} CalculatorPlaceholderProps
 * @property {boolean} isLoading - Status apakah kalkulasi sedang berjalan.
 */

/**
 * Komponen untuk menampilkan placeholder saat hasil belum ada atau sedang dimuat.
 *
 * @param {CalculatorPlaceholderProps} props
 * @returns {JSX.Element}
 */
const CalculatorPlaceholder = ({ isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center pt-10">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <Separator />
            <div className="flex min-h-[200px] flex-col items-center justify-center pt-10 text-center text-muted-foreground duration-500 animate-in fade-in">
                <Calculator className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-bold text-foreground">
                    Hasil Perhitungan Akan Tampil di Sini
                </h3>
                <p className="mt-1 text-sm">
                    Silakan isi form di atas untuk melihat hasil perhitungan
                    zakat Anda secara otomatis.
                </p>
            </div>
        </>
    );
};

export default CalculatorPlaceholder;
