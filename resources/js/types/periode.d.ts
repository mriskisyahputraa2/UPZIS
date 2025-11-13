// resources/js/types/periode.d.ts
export interface Periode {
    id: number;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: 'Aktif' | 'Tidak Aktif';
}

export interface PeriodeForm {
    name: string;
    description: string;
    start_date: string | null;
    end_date: string | null;
    status: 'Aktif' | 'Tidak Aktif';
}

export interface PaginatedPeriodes {
    data: Periode[];
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
