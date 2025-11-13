/**
 * @file resources/js/types/program.d.ts
 * @description Definisi tipe data untuk fitur program.
 */

// Tipe dasar untuk foto yang ada di database
export interface ProgramPhoto {
    id: number;
    photo_path: string;
}

// Tipe untuk data mustahik yang terhubung
export interface Mustahik {
    id: number;
    name: string;
}

// Tipe untuk data permohonan yang terhubung
export interface Permohonan {
    id: number;
    periode_id: number;
    mustahik: Mustahik;
}

// Tipe untuk data penyaluran yang tersedia untuk dihubungkan
export interface AvailablePenyaluran {
    id: number;
    amount: number;
    distribution_date: string;
    kategori_alokasi: string;
    permohonan: Permohonan;
}

// Tipe untuk data program yang diterima dari backend (untuk halaman edit)
export interface Program {
    id: number;
    name: string;
    description: string | null;
    program_date: string;
    status: 'Draft' | 'Published';
    photos: ProgramPhoto[];
}

// Tipe untuk data program dalam list di halaman index
export interface ProgramListItem extends Program {
    photos_count: number;
    penyalurans_count: number;
    penyalurans_sum_amount: number;
}

// Tipe untuk data periode yang digunakan di filter
export interface Periode {
    id: number;
    name: string;
}

// Tipe untuk data form yang digunakan oleh useForm hook
export interface ProgramForm {
    name: string;
    description: string;
    program_date: string;
    status: 'Draft' | 'Published';
    photos: File[];
    deleted_photos?: number[];
    penyaluran_ids?: number[];
    _method?: 'PUT';
}

// Tipe untuk data paginasi program
export interface PaginatedPrograms {
    data: ProgramListItem[];
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
