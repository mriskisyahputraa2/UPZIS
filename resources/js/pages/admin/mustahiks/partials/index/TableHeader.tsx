import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Periode } from '@/types';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Download,
    Info,
    PlusCircle,
    Search,
    X,
} from 'lucide-react';

/**
 * @summary Properti untuk komponen TableHeader.
 */
interface TableHeaderProps {
    filters: any;
    periodes: Periode[];
    activePeriode: Periode | null;
    search: string;
    setSearch: (value: string) => void;
    filterPeriode: string;
    setFilterPeriode: (value: string) => void;
    filterKategori: string;
    setFilterKategori: (value: string) => void;
    filterJenisKelamin: string;
    setFilterJenisKelamin: (value: string) => void;
    resetFilters: () => void;
    handlePerPageChange: (value: string) => void;
    getExportUrl: (format: 'excel' | 'pdf') => string;
}

/**
 * @summary Komponen header untuk tabel mustahik.
 * @description Berisi judul, tombol aksi (tambah, ekspor), dan semua kontrol filter
 *              (pencarian, periode, kategori, dll.) untuk memanipulasi data yang ditampilkan di tabel.
 * @param {TableHeaderProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Komponen header tabel.
 */
export default function TableHeader({
    filters,
    periodes,
    activePeriode,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterKategori,
    setFilterKategori,
    filterJenisKelamin,
    setFilterJenisKelamin,
    resetFilters,
    handlePerPageChange,
    getExportUrl,
}: TableHeaderProps): JSX.Element {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Daftar Penerima Manfaat (Mustahik)</CardTitle>
                {activePeriode ? (
                    <Link href="/admin/mustahiks/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Mustahik
                        </Button>
                    </Link>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0}>
                                    <Button disabled>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Tambah Mustahik
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Aktifkan satu periode terlebih dahulu untuk
                                    menambah data.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <CardDescription>
                Kelola data induk semua calon penerima manfaat di sini.
            </CardDescription>

            <div className="!mt-4">
                {activePeriode ? (
                    <Alert variant="info">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Periode Pendaftaran Aktif</AlertTitle>
                        <AlertDescription>
                            Saat ini periode pendaftaran yang sedang aktif
                            adalah{' '}
                            <strong className="text-green-600">
                                {activePeriode.name}
                            </strong>
                            .
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Tidak Ada Periode Aktif</AlertTitle>
                        <AlertDescription>
                            Formulir pendaftaran publik saat ini sedang ditutup.
                            <Button
                                variant="link"
                                asChild
                                className="ml-1 h-auto p-0"
                            >
                                <Link href="/admin/periode">
                                    Aktifkan periode.
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="!mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-auto sm:max-w-xs">
                        <Input
                            type="search"
                            placeholder="Cari nama atau NIK..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    <Select
                        value={String(filterPeriode)}
                        onValueChange={setFilterPeriode}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Semua Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Periode</SelectItem>
                            {periodes.map((periode) => (
                                <SelectItem
                                    key={periode.id}
                                    value={String(periode.id)}
                                >
                                    {periode.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filterKategori}
                        onValueChange={setFilterKategori}
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

                    <Select
                        value={filterJenisKelamin}
                        onValueChange={setFilterJenisKelamin}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Semua Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Jenis Kelamin
                            </SelectItem>
                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                    </Select>

                    {(filters.search ||
                        filters.periode_id ||
                        filters.jenis_kelamin ||
                        filters.kategori_pemohon) && (
                        <Button
                            variant="destructive-outline"
                            onClick={resetFilters}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>

                <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Ekspor
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <a
                                    href={getExportUrl('excel')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ekspor ke Excel (.xlsx)
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a
                                    href={getExportUrl('pdf')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ekspor ke PDF (.pdf)
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
    );
}
