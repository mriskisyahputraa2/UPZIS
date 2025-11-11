import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    if (value === null || value === undefined || isNaN(numValue)) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numValue);
};