import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

// Helper component untuk menampilkan Badge Alokasi
const AlokasiBadge = ({ kategori }) => {
    let variant: 'info' | 'success' | 'default' | 'secondary' = 'secondary';
    let label = 'Tidak Diketahui';

    switch (kategori) {
        case 'kampus':
            variant = 'info';
            label = 'Zakat (Mahasiswa)';
            break;
        case 'fakir_miskin':
            variant = 'success';
            label = 'Zakat (Fakir Miskin)';
            break;
        case 'infaq':
            variant = 'default';
            label = 'Infaq';
            break;
        case 'sedekah':
            variant = 'secondary'; // Abu-abu
            label = 'Sedekah';
            break;
    }

    return <Badge variant={variant}>{label}</Badge>;
};

export default function PenyaluranItem({
    penyaluran,
    onEdit,
    onDelete,
    showActions = true,
    className = '',
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasLongNote = penyaluran.notes && penyaluran.notes.length > 100;

    return (
        <li className={`group relative py-4 ${className}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-shrink-0">
                    <p className="text-lg font-bold">
                        {formatCurrency(penyaluran.amount)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                        <AlokasiBadge kategori={penyaluran.kategori_alokasi} />
                        <span className="text-xs text-muted-foreground">
                            • Dicatat oleh: {penyaluran.admin.name}
                        </span>
                    </div>
                </div>
                <div className="flex min-w-0 items-start gap-2">
                    <div className="min-w-0 flex-1 text-left sm:text-right">
                        <p className="text-sm font-semibold">
                            {formatDate(penyaluran.distribution_date)}
                        </p>
                        {penyaluran.notes && (
                            // <div className="max-w-xs text-xs break-words text-muted-foreground italic sm:max-w-lg">
                            // <div className="text-xs break-words text-muted-foreground italic">
                            <div className="text-xs break-words text-muted-foreground italic">
                                <p
                                    className={
                                        !isExpanded && hasLongNote
                                            ? 'line-clamp-2'
                                            : ''
                                    }
                                >
                                    "{penyaluran.notes}"
                                </p>
                                {hasLongNote && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-green-600"
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                    >
                                        {isExpanded
                                            ? '...lebih sedikit'
                                            : '...lihat selengkapnya'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                    {showActions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <Ellipsis className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onSelect={() => onEdit(penyaluran)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => onDelete(penyaluran)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </li>
    );
}
