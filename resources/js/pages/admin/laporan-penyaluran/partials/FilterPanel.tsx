/**
 * @file FilterPanel.tsx
 * @description Panel filter lengkap untuk laporan penyaluran.
 *
 * @component FilterPanel
 * @returns {JSX.Element}
 */
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, Search, X } from 'lucide-react';
import React from 'react';

interface Periode {
    id: number;
    name: string;
}

interface FilterPanelProps {
    filters: any;
    setters: {
        setSearch: (value: string) => void;
        setKategoriPenerima: (value: string) => void;
        setKategoriAlokasi: (value: string) => void;
        setPeriodeId: (value: string) => void;
        setDate: (date: any) => void;
    };
    values: {
        search: string;
        kategoriPenerima: string;
        kategoriAlokasi: string;
        periodeId: string;
        date: any;
    };
    periodes: Periode[];
    resetFilters: () => void;
    handlePerPageChange: (value: string) => void;
    getExportUrl: (format: 'excel' | 'pdf') => string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    filters,
    setters,
    values,
    periodes,
    resetFilters,
    handlePerPageChange,
    getExportUrl,
}) => {
    return (
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative w-full flex-1 sm:max-w-xs">
                    <Input
                        type="search"
                        placeholder="Cari nama mustahik..."
                        value={values.search}
                        onChange={(e) => setters.setSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* Kategori Penerima */}
                <Select
                    value={values.kategoriPenerima}
                    onValueChange={setters.setKategoriPenerima}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                        <SelectItem value="umum">Fakir/Miskin</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sumber Dana */}
                <Select
                    value={values.kategoriAlokasi}
                    onValueChange={setters.setKategoriAlokasi}
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Semua Sumber Dana" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Sumber Dana</SelectItem>
                        <SelectItem value="kampus">Zakat (Kampus)</SelectItem>
                        <SelectItem value="fakir_miskin">
                            Zakat (Fakir Miskin)
                        </SelectItem>
                        <SelectItem value="infaq">Infaq</SelectItem>
                        <SelectItem value="sedekah">Sedekah</SelectItem>
                    </SelectContent>
                </Select>

                {/* Periode */}
                <Select
                    value={String(values.periodeId)}
                    onValueChange={setters.setPeriodeId}
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Semua Periode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Periode</SelectItem>
                        {periodes.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-full justify-start text-left font-normal sm:w-auto',
                                !values.date?.from && 'text-muted-foreground',
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {values.date?.from ? (
                                values.date.to ? (
                                    <>
                                        {format(values.date.from, 'LLL dd, y')}{' '}
                                        - {format(values.date.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(values.date.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pilih tanggal</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={values.date}
                            onSelect={setters.setDate}
                            numberOfMonths={2}
                            locale={id}
                        />
                    </PopoverContent>
                </Popover>

                {/* Reset Button */}
                {(filters.search ||
                    filters.periode_id ||
                    filters.kategori_alokasi ||
                    filters.kategori_pemohon ||
                    filters.start_date) && (
                    <Button
                        variant="destructive-outline"
                        onClick={resetFilters}
                    >
                        <X className="mr-2 h-4 w-4" /> Reset
                    </Button>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                <Select
                    onValueChange={handlePerPageChange}
                    defaultValue={String(filters.per_page || '10')}
                >
                    <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 Data</SelectItem>
                        <SelectItem value="10">10 Data</SelectItem>
                        <SelectItem value="25">25 Data</SelectItem>
                        <SelectItem value="50">50 Data</SelectItem>
                        <SelectItem value="100">100 Data</SelectItem>
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Ekspor
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <a href={getExportUrl('excel')} target="_blank">
                                Ekspor ke Excel (.xlsx)
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={getExportUrl('pdf')} target="_blank">
                                Ekspor ke PDF (.pdf)
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default FilterPanel;
