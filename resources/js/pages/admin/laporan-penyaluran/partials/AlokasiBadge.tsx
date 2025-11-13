/**
 * @file AlokasiBadge.tsx
 * @description Komponen Badge untuk menampilkan kategori alokasi dana (sumber dana).
 *
 * @component AlokasiBadge
 * @param {object} props - Properti komponen.
 * @param {string} props.kategori - Nama kategori alokasi (e.g., 'kampus', 'infaq').
 * @returns {JSX.Element} Komponen Badge dengan warna dan label yang sesuai.
 */
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface AlokasiBadgeProps {
    kategori: string;
}

const AlokasiBadge: React.FC<AlokasiBadgeProps> = ({ kategori }) => {
    let variant: 'info' | 'success' | 'default' | 'secondary' = 'secondary';
    let label = 'Tidak Diketahui';

    switch (kategori) {
        case 'kampus':
            variant = 'info';
            label = 'Zakat (Kampus)';
            break;
        case 'fakir_miskin':
            variant = 'success';
            label = 'Zakat (Fakir Miskin)';
            break;
        case 'infaq':
            variant = 'default';
            label = 'Infaq';
            break;
        case 'sedekah':
            variant = 'secondary';
            label = 'Sedekah';
            break;
    }
    return <Badge variant={variant}>{label}</Badge>;
};

export default AlokasiBadge;
