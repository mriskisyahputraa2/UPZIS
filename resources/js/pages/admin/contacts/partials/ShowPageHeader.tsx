/**
 * @file ShowPageHeader.tsx
 * @description Komponen header untuk halaman detail kontak.
 * Menampilkan tombol kembali, judul halaman, dan tanggal pesan diterima.
 *
 * @component ShowPageHeader
 * @param {object} props - Properti komponen.
 * @param {string} props.formattedDate - Tanggal pesan yang sudah diformat.
 * @returns {JSX.Element} Komponen header halaman detail.
 */
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface ShowPageHeaderProps {
    formattedDate: string;
}

const ShowPageHeader: React.FC<ShowPageHeaderProps> = ({ formattedDate }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/admin/kontak" preserveState={false}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Detail Pesan Masuk</h1>
                    <p className="text-sm text-muted-foreground">
                        Pesan diterima pada {formattedDate} WIB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShowPageHeader;
