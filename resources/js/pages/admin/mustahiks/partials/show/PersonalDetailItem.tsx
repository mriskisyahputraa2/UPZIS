import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

/**
 * @summary Properti untuk komponen PersonalDetailItem.
 */
interface PersonalDetailItemProps {
    /** Komponen ikon yang akan ditampilkan. */
    icon: React.ElementType;
    /** Label untuk item detail. */
    label: string;
    /** Nilai untuk item detail. */
    value?: string | number | null;
    /** Anak-anak React untuk konten kustom. */
    children?: React.ReactNode;
    /** Apakah tombol salin harus ditampilkan. */
    canCopy?: boolean;
}

/**
 * @summary Komponen untuk menampilkan satu item detail personal.
 * @description Menampilkan ikon, label, dan nilai dari sebuah data.
 *              Menyediakan fungsionalitas untuk menyalin nilai ke clipboard jika diaktifkan.
 * @param {PersonalDetailItemProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen item detail.
 */
export default function PersonalDetailItem({
    icon: Icon,
    label,
    value,
    children,
    canCopy = false,
}: PersonalDetailItemProps): JSX.Element {
    const copyToClipboard = () => {
        if (!value) return;
        navigator.clipboard.writeText(String(value));
        toast.success(`"${label}" berhasil disalin!`);
    };

    return (
        <div className="flex items-start justify-between py-3">
            <div className="flex items-start gap-4">
                <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="break-all font-semibold text-foreground">
                        {children || value || '-'}
                    </div>
                </div>
            </div>
            {canCopy && value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={copyToClipboard}
                    aria-label={`Salin ${label}`}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
