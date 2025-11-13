/**
 * @file resources/js/types/admin.d.ts
 * @description Definisi tipe data untuk fitur manajemen admin.
 */

// Tipe untuk data admin yang diterima dari backend
export interface Admin {
    id: number;
    name: string;
    email: string;
}

// Tipe untuk data form yang digunakan oleh useForm hook
export interface AdminForm {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}

// Tipe untuk data paginasi admin
export interface PaginatedAdmins {
    data: Admin[];
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
