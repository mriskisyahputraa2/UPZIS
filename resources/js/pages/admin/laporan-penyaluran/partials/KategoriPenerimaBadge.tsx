/**
 * @file KategoriPenerimaBadge.tsx
 * @description Komponen Badge untuk menampilkan kategori penerima bantuan.
 *
 * @component KategoriPenerimaBadge
 * @param {object} props - Properti komponen.
 * @param {string | null} props.kategori - Nama kategori penerima ('mahasiswa' atau 'umum').
 * @returns {JSX.Element | null} Komponen Badge atau null jika tidak ada kategori.
 */
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface KategoriPenerimaBadgeProps {
    kategori: string | null;
}

const KategoriPenerimaBadge: React.FC<KategoriPenerimaBadgeProps> = ({
    kategori,
}) => {
    if (!kategori) return null;
    const isMahasiswa = kategori === 'mahasiswa';
    return (
        <Badge variant={isMahasiswa ? 'info' : 'warning'}>
            {isMahasiswa ? 'Mahasiswa' : 'Fakir/Miskin'}
        </Badge>
    );
};

export default KategoriPenerimaBadge;
