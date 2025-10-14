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
                    <p className="text-sm text-muted-foreground">
                        Dicatat oleh: {penyaluran.admin.name}
                    </p>
                </div>
                <div className="flex min-w-0 items-start gap-2">
                    <div className="min-w-0 flex-1 text-left sm:text-right">
                        <p className="text-sm font-semibold">
                            {formatDate(penyaluran.distribution_date)}
                        </p>
                        {penyaluran.notes && (
                            <div className="max-w-xs text-xs break-words text-muted-foreground italic sm:max-w-lg">
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
