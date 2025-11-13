import { Button } from '@/components/ui/button';
import { FileText, ZoomIn, Download } from 'lucide-react';
import React from 'react';

/**
 * @summary Properti untuk komponen DocumentCard.
 */
interface DocumentCardProps {
    /** Path atau URL ke file dokumen. */
    filePath?: string | null;
    /** Label atau nama dokumen. */
    label: string;
}

const isImage = (fileName?: string | null) =>
    fileName && /\.(jpe?g|png|gif|webp)$/i.test(fileName);

/**
 * @summary Kartu untuk menampilkan sebuah dokumen.
 * @description Menampilkan pratinjau gambar jika file adalah gambar, atau ikon file generik.
 *              Menyediakan tombol untuk melihat (zoom) dan mengunduh file saat di-hover.
 * @param {DocumentCardProps} props - Properti untuk komponen.
 * @returns {JSX.Element | null} Komponen kartu dokumen, atau null jika tidak ada file.
 */
export default function DocumentCard({
    filePath,
    label,
}: DocumentCardProps): JSX.Element | null {
    if (!filePath) return null;

    const fileUrl = `/storage/${filePath}`;

    return (
        <div className="group relative overflow-hidden rounded-lg border">
            {isImage(filePath) ? (
                <img
                    src={fileUrl}
                    alt={label}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="flex h-28 w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-xs text-gray-500">
                        File Dokumen
                    </span>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Lihat"
                >
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </a>
                <a href={fileUrl} download title="Unduh">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                    </Button>
                </a>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="truncate text-xs font-semibold text-white">
                    {label}
                </p>
            </div>
        </div>
    );
}
