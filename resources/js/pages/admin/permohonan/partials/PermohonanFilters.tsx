import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function PermohonanFilters({ filters, periodes }) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
    const [filterPeriode, setFilterPeriode] = useState(
        filters.periode_id || 'all',
    );
    const [filterJenisKelamin, setFilterJenisKelamin] = useState(
        filters.jenis_kelamin || 'all',
    );
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const params = {
            search,
            per_page: filters.per_page,
            status: filterStatus === 'all' ? '' : filterStatus,
            periode_id: filterPeriode === 'all' ? '' : filterPeriode,
            jenis_kelamin:
                filterJenisKelamin === 'all' ? '' : filterJenisKelamin,
        };
        const timeout = setTimeout(() => {
            router.get('/admin/permohonan', params, {
                preserveState: true,
                replace: true,
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, filterStatus, filterPeriode, filterJenisKelamin]);

    const resetFilters = () => {
        setSearch('');
        setFilterStatus('all');
        setFilterPeriode('all');
        setFilterJenisKelamin('all');
    };

    const handlePerPageChange = (perPage) => {
        const params = { ...filters, per_page: perPage };
        router.get('/admin/permohonan', params, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full flex-1 sm:max-w-xs">
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

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Baru">Baru</SelectItem>
                        <SelectItem value="Diverifikasi">
                            Diverifikasi
                        </SelectItem>
                        <SelectItem value="Disetujui">Disetujui</SelectItem>
                        <SelectItem value="Ditolak">Ditolak</SelectItem>
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
                        <SelectItem value="all">Semua Jenis Kelamin</SelectItem>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                </Select>

                {(filters.search || filters.status || filters.periode_id) && (
                    <Button
                        variant="destructive-outline"
                        onClick={resetFilters}
                    >
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
}
