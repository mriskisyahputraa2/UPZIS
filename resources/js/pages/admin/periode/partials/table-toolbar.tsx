import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

/**
 * @interface TableToolbarProps
 * @description Properti untuk komponen TableToolbar.
 * @property {string} search - Nilai state untuk input pencarian.
 * @property {(value: string) => void} onSearchChange - Handler untuk perubahan input pencarian.
 * @property {string} perPage - Nilai state untuk jumlah data per halaman.
 * @property {(value: string) => void} onPerPageChange - Handler untuk perubahan jumlah data per halaman.
 */
interface TableToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    perPage: string;
    onPerPageChange: (value: string) => void;
}

/**
 * @name TableToolbar
 * @description Komponen toolbar untuk tabel, berisi fungsionalitas pencarian dan filter jumlah data per halaman.
 * @param {TableToolbarProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const TableToolbar = ({
    search,
    onSearchChange,
    perPage,
    onPerPageChange,
}: TableToolbarProps) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
                <Input
                    type="search"
                    placeholder="Cari nama periode..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Select onValueChange={onPerPageChange} defaultValue={perPage}>
                <SelectTrigger className="w-[120px]">
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
    );
};

export default TableToolbar;
