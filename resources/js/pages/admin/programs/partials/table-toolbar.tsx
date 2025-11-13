import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Periode } from '@/types/program';
import { Search, X } from 'lucide-react';

/**
 * @interface TableToolbarProps
 * @description Properti untuk komponen TableToolbar.
 */
interface TableToolbarProps {
    filters: {
        search?: string;
        status?: string;
        periode_id?: string;
        per_page?: string;
    };
    periodes: Periode[];
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPeriodeChange: (value: string) => void;
    onPerPageChange: (value: string) => void;
    onResetFilters: () => void;
}

/**
 * @name TableToolbar
 * @description Komponen toolbar untuk tabel program, berisi fungsionalitas filter.
 * @returns {JSX.Element}
 */
const TableToolbar = ({
    filters,
    periodes,
    onSearchChange,
    onStatusChange,
    onPeriodeChange,
    onPerPageChange,
    onResetFilters,
}: TableToolbarProps) => {
    const showResetButton =
        filters.search || filters.status || filters.periode_id;

    return (
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full flex-1 sm:max-w-xs">
                    <Input
                        type="search"
                        placeholder="Cari nama program..."
                        value={filters.search || ''}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Select
                    value={String(filters.periode_id || 'all')}
                    onValueChange={onPeriodeChange}
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
                <Select
                    value={filters.status || 'all'}
                    onValueChange={onStatusChange}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
                {showResetButton && (
                    <Button
                        variant="destructive-outline"
                        onClick={onResetFilters}
                    >
                        <X className="mr-2 h-4 w-4" /> Reset
                    </Button>
                )}
            </div>
            <div className="w-full sm:w-auto">
                <Select
                    onValueChange={onPerPageChange}
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

export default TableToolbar;
