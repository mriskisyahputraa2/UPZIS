/**
 * @file FilterPanel.tsx
 * @description Komponen panel filter untuk halaman daftar kontak.
 * Termasuk fungsionalitas pencarian, filter status, reset, dan item per halaman.
 *
 * @component FilterPanel
 * @param {object} props - Properti komponen.
 * @param {string} props.search - Nilai state untuk input pencarian.
 * @param {(value: string) => void} props.setSearch - Fungsi untuk mengubah state pencarian.
 * @param {string} props.status - Nilai state untuk filter status.
 * @param {(value: string) => void} props.setStatus - Fungsi untuk mengubah state status.
 * @param {() => void} props.resetFilters - Fungsi untuk mereset semua filter.
 * @param {object} props.filters - Objek filter dari Inertia.
 * @param {(value: string) => void} props.handlePerPageChange - Fungsi untuk mengubah jumlah item per halaman.
 * @returns {JSX.Element} Komponen panel filter.
 */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import React from 'react';

interface FilterPanelProps {
    search: string;
    setSearch: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    resetFilters: () => void;
    filters: { search?: string; status?: string; per_page?: number };
    handlePerPageChange: (value: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    search,
    setSearch,
    status,
    setStatus,
    resetFilters,
    filters,
    handlePerPageChange,
}) => {
    return (
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full flex-1 sm:max-w-xs">
                    <Input
                        type="search"
                        placeholder="Cari nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Baru">Baru</SelectItem>
                        <SelectItem value="Sudah Dibaca">Sudah Dibaca</SelectItem>
                    </SelectContent>
                </Select>
                {(filters.search || filters.status) && (
                    <Button variant="destructive-outline" onClick={resetFilters}>
                        <X className="mr-2 h-4 w-4" /> Reset
                    </Button>
                )}
            </div>
            <div className="w-full sm:w-auto">
                <Select
                    onValueChange={handlePerPageChange}
                    defaultValue={String(filters.per_page || '5')}
                >
                    <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 Data</SelectItem>
                        <SelectItem value="10">10 Data</SelectItem>
                        <SelectItem value="20">20 Data</SelectItem>
                        <SelectItem value="50">50 Data</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FilterPanel;
