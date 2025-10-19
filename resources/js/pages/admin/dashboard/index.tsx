import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    AlertTriangle,
    Banknote,
    Calendar as CalendarIcon,
    CreditCard,
    FileClock,
    HandCoins,
    Handshake,
    Info,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

// Komponen Kartu Statistik
const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    link,
    linkText,
    linkColorClass,
}) => (
    <Card className="flex flex-col shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between">
            <div>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {link && (
                <Button
                    variant="link"
                    asChild
                    className={`mt-2 h-auto justify-start p-0 ${linkColorClass}`}
                >
                    <Link href={link}>{linkText}</Link>
                </Button>
            )}
        </CardContent>
    </Card>
);

// Fungsi format mata uang
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

// Label periode
const periodLabels = {
    today: 'Hari Ini',
    week: 'Minggu Ini',
    month: 'Bulan Ini',
    year: 'Tahun Ini',
    all: 'Semua Waktu',
    custom: 'Rentang Kustom',
};

// Komponen Filter Dana Terkumpul
const DateRangePicker = ({ activeFilters }) => {
    const [date, setDate] = useState({
        from: activeFilters.start_date
            ? new Date(activeFilters.start_date + 'T00:00:00')
            : undefined,
        to: activeFilters.end_date
            ? new Date(activeFilters.end_date + 'T00:00:00')
            : undefined,
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleFilter = (params) => {
        router.get('/admin/dashboard', params, {
            preserveState: true,
            preserveScroll: true,
            only: ['stats', 'activeFilters'],
            onSuccess: () => setIsOpen(false),
        });
    };

    const handlePreset = (period) => {
        handleFilter({ period });
    };

    const applyCustomDate = () => {
        if (date?.from && date?.to) {
            handleFilter({
                period: 'custom',
                start_date: format(date.from, 'y-MM-dd'),
                end_date: format(date.to, 'y-MM-dd'),
            });
        }
    };

    let activeLabel = periodLabels[activeFilters.period];
    if (
        activeFilters.period === 'custom' &&
        activeFilters.start_date &&
        activeFilters.end_date
    ) {
        activeLabel = `${format(new Date(activeFilters.start_date + 'T00:00:00'), 'dd LLL y', { locale: id })} - ${format(new Date(activeFilters.end_date + 'T00:00:00'), 'dd LLL y', { locale: id })}`;
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full min-w-[240px] justify-start text-left font-normal sm:w-auto',
                        !activeLabel && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {activeLabel || 'Pilih Waktu'}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="flex w-auto flex-col p-0 sm:flex-row"
                align="end"
            >
                <div className="flex flex-col space-y-2 border-b p-4 sm:border-r sm:border-b-0">
                    <Button
                        variant={
                            activeFilters.period === 'today'
                                ? 'secondary'
                                : 'ghost'
                        }
                        className="justify-start"
                        onClick={() => handlePreset('today')}
                    >
                        Hari Ini
                    </Button>
                    <Button
                        variant={
                            activeFilters.period === 'week'
                                ? 'secondary'
                                : 'ghost'
                        }
                        className="justify-start"
                        onClick={() => handlePreset('week')}
                    >
                        Minggu Ini
                    </Button>
                    <Button
                        variant={
                            activeFilters.period === 'month'
                                ? 'secondary'
                                : 'ghost'
                        }
                        className="justify-start"
                        onClick={() => handlePreset('month')}
                    >
                        Bulan Ini
                    </Button>
                    <Button
                        variant={
                            activeFilters.period === 'year'
                                ? 'secondary'
                                : 'ghost'
                        }
                        className="justify-start"
                        onClick={() => handlePreset('year')}
                    >
                        Tahun Ini
                    </Button>
                    <Button
                        variant={
                            activeFilters.period === 'all'
                                ? 'secondary'
                                : 'ghost'
                        }
                        className="justify-start"
                        onClick={() => handlePreset('all')}
                    >
                        Semua Waktu
                    </Button>
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
    );
};

// Komponen filter penyaluran
const PenyaluranPeriodFilter = ({ periodes, activeFilterId }) => {
    const handleFilterChange = (value) => {
        router.get(
            '/admin/dashboard',
            { penyaluran_periode_id: value },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['stats', 'activeFilters'],
            },
        );
    };

    return (
        <Select
            defaultValue={activeFilterId}
            onValueChange={handleFilterChange}
        >
            <SelectTrigger className="w-full sm:min-w-[240px]">
                <SelectValue placeholder="Filter Periode Penyaluran..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Periode</SelectItem>
                {periodes.map((periode) => (
                    <SelectItem key={periode.id} value={String(periode.id)}>
                        {periode.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

// Komponen Utama Dashboard
export default function Dashboard({
    stats,
    activeFilters,
    activePeriode,
    periodes,
    recentMuzakkis,
}) {
    const breadcrumbs = [{ title: 'Dashboard' }];

    let titleLabel = periodLabels[activeFilters.period];
    if (
        activeFilters.period === 'custom' &&
        activeFilters.start_date &&
        activeFilters.end_date
    ) {
        titleLabel = `${format(new Date(activeFilters.start_date + 'T00:00:00'), 'dd LLL yy')} - ${format(new Date(activeFilters.end_date + 'T00:00:00'), 'dd LLL yy')}`;
    }

    let penyaluranTitle = 'Semua Periode';
    if (activeFilters.penyaluran_periode_id !== 'all') {
        const selectedPeriode = periodes.find(
            (p) => p.id == activeFilters.penyaluran_periode_id,
        );
        if (selectedPeriode) {
            penyaluranTitle = selectedPeriode.name;
        }
    }

    // Fungsi untuk menentukan warna badge status
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Berhasil':
                return 'success';
            case 'Menunggu Verifikasi':
                return 'warning';
            case 'Gagal':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header Utama dan Filter */}
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Dashboard Analitik
                        </h1>
                        <p className="text-muted-foreground">
                            Ringkasan aktivitas dan dana terkumpul di UPZIS.
                        </p>
                    </div>
                    {/* Wadah filter dibuat responsif */}
                    <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <DateRangePicker activeFilters={activeFilters} />
                        <PenyaluranPeriodFilter
                            periodes={periodes}
                            activeFilterId={activeFilters.penyaluran_periode_id}
                        />
                    </div>
                </div>

                {/* Alert Periode Aktif */}
                {activePeriode ? (
                    <Alert
                        variant="info"
                        className="border-blue-200 bg-blue-50"
                    >
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="font-bold text-blue-800">
                            Periode Pendaftaran Mustahik Sedang Dibuka
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                            Saat ini pendaftaran dibuka untuk periode:{' '}
                            <strong>{activePeriode.name}</strong>.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert
                        variant="warning"
                        className="border-yellow-200 bg-yellow-50"
                    >
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="font-bold text-yellow-800">
                            Pendaftaran Mustahik Ditutup
                        </AlertTitle>
                        <AlertDescription className="text-yellow-700">
                            Tidak ada periode pendaftaran yang sedang aktif.
                            <Button
                                variant="link"
                                asChild
                                className="h-auto p-0 text-yellow-800 hover:text-yellow-900"
                            >
                                <Link href="/admin/periode">
                                    Aktifkan Periode
                                </Link>
                            </Button>
                            .
                        </AlertDescription>
                    </Alert>
                )}

                {/* Grid untuk dua kartu utama */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Kartu Dana Terkumpul */}
                    <Card className="bg-green-600 text-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote />
                                Total Dana Terkumpul ({titleLabel})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold break-all md:text-5xl">
                                {formatCurrency(stats.totalDanaTerkumpul)}
                            </p>
                            <div className="mt-4 grid grid-cols-1 gap-4 text-green-100 sm:grid-cols-3">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5" />
                                    <div>
                                        <p className="text-xs">DANA</p>
                                        <p className="text-sm font-bold sm:text-base">
                                            {formatCurrency(
                                                stats.danaPerMetode.DANA,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    <div>
                                        <p className="text-xs">GoPay</p>
                                        <p className="text-sm font-bold sm:text-base">
                                            {formatCurrency(
                                                stats.danaPerMetode.GoPay,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HandCoins className="h-5 w-5" />
                                    <div>
                                        <p className="text-xs">Tunai</p>
                                        <p className="text-sm font-bold break-all sm:text-base">
                                            {formatCurrency(
                                                stats.danaPerMetode.Tunai,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kartu Dana Disalurkan */}
                    <Card className="bg-blue-500 text-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Handshake />
                                Total Dana Disalurkan ({penyaluranTitle})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold break-all md:text-5xl">
                                {formatCurrency(stats.totalDanaDisalurkan)}
                            </p>
                            <p className="mt-4 text-sm text-blue-100">
                                Jumlah total dana yang telah disalurkan kepada
                                mustahik sesuai periode yang dipilih.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                <div>
                    <h2 className="text-xl font-bold">Statistik Lainnya</h2>
                    <p className="text-muted-foreground">
                        Ringkasan status permohonan dan verifikasi.
                    </p>
                </div>

                {/* Grid statistik dibuat responsif */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <StatCard
                        title="Menunggu Verifikasi"
                        value={formatCurrency(stats.danaMenungguVerifikasi)}
                        icon={FileClock}
                        description={`dari ${stats.transaksiBaru} transaksi perlu diperiksa`}
                        link="/admin/transaksi?status=Menunggu Verifikasi"
                        linkText="Lihat Daftar Transaksi"
                        linkColorClass="text-green-600 hover:text-green-700"
                    />

                    <StatCard
                        title="Permohonan Baru Masuk"
                        value={stats.permohonanBaru}
                        icon={FileClock}
                        description="perlu segera diverifikasi"
                        link={
                            stats.permohonanBaru > 0
                                ? '/admin/permohonan?status=Baru'
                                : undefined
                        }
                        linkText="Lihat Daftar Permohonan"
                        linkColorClass="text-blue-600 hover:text-blue-700"
                    />

                    <StatCard
                        title="Total Mustahik Terbantu"
                        value={stats.totalMustahikDisetujui}
                        icon={Users}
                        description="siap untuk menerima bantuan"
                    />
                </div>

                {/* Kartu 5 Muzakki Terbaru */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            Daftar Transaksi Muzakki Terbaru (5)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentMuzakkis.length > 0 ? (
                                recentMuzakkis.map((transaksi) => (
                                    <div
                                        key={transaksi.id}
                                        className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">
                                                {transaksi.user.name}
                                            </p>
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    transaksi.status,
                                                )}
                                            >
                                                {transaksi.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-semibold text-muted-foreground">
                                            {formatCurrency(
                                                transaksi.final_amount,
                                            )}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada transaksi yang masuk.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
