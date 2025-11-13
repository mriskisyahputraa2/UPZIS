/**
 * @file resources/js/types/zakat-type.d.ts
 * @description Definisi tipe data untuk fitur manajemen jenis zakat.
 */

// Tipe untuk data jenis zakat yang diterima dari backend
export interface ZakatType {
    id: number;
    name: string;
    description: string;
    rate_percent: string;
    nisab_basis: 'emas' | 'perak' | 'beras' | 'uang';
    nisab_quantity: string;
    status: 'Aktif' | 'Tidak Aktif';
}

// Tipe untuk data form yang digunakan oleh useForm hook
export interface ZakatTypeForm {
    name: string;
    description: string;
    rate_percent: string;
    nisab_basis: 'emas' | 'perak' | 'beras' | 'uang';
    nisab_quantity: string;
    status: 'Aktif' | 'Tidak Aktif';
}

// Tipe untuk data paginasi jenis zakat
export interface PaginatedZakatTypes {
    data: ZakatType[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    from: number;
    to: number;
    total: number;
    per_page: number;
}
