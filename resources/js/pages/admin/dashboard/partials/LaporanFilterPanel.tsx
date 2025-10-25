import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

const periodLabels = {
    today: 'Hari Ini',
    week: 'Minggu Ini',
    month: 'Bulan Ini',
    year: 'Tahun Ini',
    all: 'Semua Waktu',
    custom: 'Rentang Kustom',
};

export default function LaporanFilterPanel({ periodes, activeFilters }) {
    const [filters, setFilters] = useState({
        periode_id: activeFilters.periode_id || 'all',
        period: activeFilters.period || 'today',
        start_date: activeFilters.start_date || '',
        end_date: activeFilters.end_date || '',
        payment_method: activeFilters.payment_method || 'all',
    });
    const [date, setDate] = useState({
        from: filters.start_date
            ? new Date(filters.start_date + 'T00:00:00')
            : undefined,
        to: filters.end_date
            ? new Date(filters.end_date + 'T00:00:00')
            : undefined,
    });
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key === 'periode_id' && value !== 'all') {
            newFilters.period = 'all';
            newFilters.start_date = '';
            newFilters.end_date = '';
            setDate({ from: undefined, to: undefined });
        }
        setFilters(newFilters);
    };

    const handleDatePreset = (period) => {
        setFilters((prev) => ({ ...prev, period, periode_id: 'all' }));
        setIsDatePopoverOpen(false);
    };

    const applyCustomDate = () => {
        if (date?.from && date?.to) {
            setFilters((prev) => ({
                ...prev,
                period: 'custom',
                periode_id: 'all',
                start_date: format(date.from, 'y-MM-dd'),
                end_date: format(date.to, 'y-MM-dd'),
            }));
        }
        setIsDatePopoverOpen(false);
    };

    const applyFilters = () => {
        const params = { ...filters };
        if (params.period !== 'custom' && params.periode_id === 'all') {
            delete params.start_date;
            delete params.end_date;
        }
        if (params.periode_id === 'all') delete params.periode_id;
        if (params.payment_method === 'all') delete params.payment_method;
        if (params.period === 'all' && !params.periode_id) delete params.period;

        router.get('/admin/dashboard', params, {
            preserveState: true,
            preserveScroll: true,
            only: ['performanceStats', 'activeFilters'],
        });
    };

    let activeDateLabel = periodLabels[filters.period];
    if (filters.period === 'custom' && filters.start_date && filters.end_date) {
        activeDateLabel = `${format(new Date(filters.start_date + 'T00:00:00'), 'dd LLL y', { locale: id })} - ${format(new Date(filters.end_date + 'T00:00:00'), 'dd LLL y', { locale: id })}`;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filter Laporan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-end gap-4 sm:flex-row">
                <div className="grid w-full flex-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Berdasarkan Periode</Label>
                        <Select
                            value={filters.periode_id}
                            onValueChange={(val) =>
                                handleFilterChange('periode_id', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    -- Filter Waktu --
                                </SelectItem>
                                {periodes.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Berdasarkan Waktu</Label>
                        <Popover
                            open={isDatePopoverOpen}
                            onOpenChange={setIsDatePopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !activeDateLabel &&
                                            'text-muted-foreground',
                                    )}
                                    disabled={filters.periode_id !== 'all'}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.periode_id !== 'all'
                                        ? 'Sesuai Periode'
                                        : activeDateLabel || 'Pilih Waktu'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="flex w-auto flex-col p-0 sm:flex-row"
                                align="start"
                            >
                                <div className="flex flex-col space-y-2 border-b p-4 sm:border-r sm:border-b-0">
                                    {Object.keys(periodLabels).map(
                                        (periodKey) => (
                                            <Button
                                                key={periodKey}
                                                variant={
                                                    filters.period === periodKey
                                                        ? 'secondary'
                                                        : 'ghost'
                                                }
                                                className="justify-start"
                                                onClick={() =>
                                                    handleDatePreset(periodKey)
                                                }
                                            >
                                                {periodLabels[periodKey]}
                                            </Button>
                                        ),
                                    )}
                                </div>
                                <div className="p-2">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                        locale={id}
                                    />
                                    <div className="border-t p-2">
                                        <Button
                                            onClick={applyCustomDate}
                                            disabled={!date?.from || !date?.to}
                                            className="w-full"
                                        >
                                            Terapkan
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Metode Pembayaran</Label>
                        <Select
                            value={filters.payment_method}
                            onValueChange={(val) =>
                                handleFilterChange('payment_method', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Metode
                                </SelectItem>
                                <SelectItem value="DANA">DANA</SelectItem>
                                <SelectItem value="GoPay">GoPay</SelectItem>
                                <SelectItem value="Tunai">Tunai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={applyFilters} className="w-full sm:w-auto">
                    Terapkan Filter
                </Button>
            </CardContent>
        </Card>
    );
}
