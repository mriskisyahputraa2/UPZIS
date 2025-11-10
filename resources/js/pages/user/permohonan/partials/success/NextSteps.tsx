import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} NextStepsProps
 * @property {string} unique_code - Kode pendaftaran unik untuk disertakan dalam link pelacakan.
 */

/**
 * Komponen untuk menampilkan tombol aksi langkah selanjutnya setelah pendaftaran berhasil.
 * Mengarahkan pengguna untuk melacak status atau kembali ke beranda.
 *
 * @param {NextStepsProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const NextSteps = ({ unique_code }) => {
    return (
        <div className="mt-8 text-center">
            <h3 className="text-xl font-bold">Langkah Selanjutnya</h3>
            <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href={`/lacak-status?kode=${unique_code}`}>
                    <Button
                        className="w-full text-base font-bold"
                        size="lg"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Lacak Status Permohonan
                    </Button>
                </Link>
                <Link href="/">
                    <Button
                        variant="outline"
                        className="w-full text-base font-bold"
                        size="lg"
                    >
                        Kembali ke Beranda
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NextSteps;
