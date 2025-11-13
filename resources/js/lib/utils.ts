import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format as formatDateFn } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Menggabungkan beberapa class name menjadi satu string.
 * Berguna untuk styling kondisional di komponen React.
 * @param inputs - Daftar class name.
 * @returns String class name yang sudah digabung.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Memformat angka menjadi format mata uang Rupiah (IDR).
 * @param value - Angka yang akan diformat.
 * @returns String dalam format mata uang (e.g., "Rp 50.000").
 * Mengembalikan string kosong jika value tidak valid.
 */
export const formatCurrency = (value: number | string | null | undefined) => {
    const numValue = Number(value);
    if (value === null || value === undefined || isNaN(numValue)) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(0);
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numValue);
};

/**
 * Memformat tanggal menjadi format tanggal Indonesia (e.g., "17 Agt 2024").
 * @param dateString - String tanggal yang valid.
 * @returns String tanggal yang sudah diformat atau string kosong jika tidak valid.
 */
export const formatDate = (dateString: string) => {
    try {
        return formatDateFn(new Date(dateString), 'dd MMM yyyy', {
            locale: id,
        });
    } catch (error) {
        return '';
    }
};
