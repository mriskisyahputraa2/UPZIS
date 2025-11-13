import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

/**
 * @summary Properti untuk komponen PageHeader.
 */
interface PageHeaderProps {
    /** Judul utama yang akan ditampilkan di header dan tag <Head>. */
    title: string;
    /** Deskripsi singkat yang muncul di bawah judul. */
    description: string;
    /** URL tujuan untuk tombol kembali. */
    backHref: string;
    /** Anak-anak React opsional untuk ditambahkan di sebelah kanan header. */
    children?: React.ReactNode;
}

/**
 * @summary Komponen header halaman yang dapat digunakan kembali.
 * @description Menampilkan tombol kembali, judul, deskripsi, dan slot untuk aksi tambahan.
 *              Juga secara otomatis mengatur judul halaman menggunakan Inertia's <Head>.
 * @param {PageHeaderProps} props - Properti untuk mengkonfigurasi header.
 * @returns {JSX.Element} Komponen header yang dirender.
 */
export default function PageHeader({
    title,
    description,
    backHref,
    children,
}: PageHeaderProps): JSX.Element {
    return (
        <>
            <Head title={title} />
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                    <Link href={backHref}>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">{title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                {children && (
                    <div className="w-full flex-shrink-0 gap-2 md:flex md:w-auto">
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}
