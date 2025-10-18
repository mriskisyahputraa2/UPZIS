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

export default function TransactionFilters({ filters, setIsLoading }) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
    const [filterType, setFilterType] = useState(filters.type || 'all');
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
            type: filterType === 'all' ? '' : filterType, // ## PERUBAHAN 2: Tambahkan 'type' ke parameter request ##
        };
        const timeout = setTimeout(() => {
            router.get('/admin/transaksi', params, {
                preserveState: true,
                replace: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, filterStatus, filterType]); // ## PERUBAHAN 3: Tambahkan 'filterType' ke dependency array ##

    const resetFilters = () => {
        setSearch('');
        setFilterStatus('all');
        setFilterType('all'); // ## PERUBAHAN 4: Reset filter 'type' juga ##
    };

    const handlePerPageChange = (perPage) => {
        router.get(
            '/admin/transaksi',
            {
                ...filters,
                search,
                status: filterStatus === 'all' ? '' : filterStatus,
                type: filterType === 'all' ? '' : filterType, // ## PERUBAHAN 5: Tambahkan 'type' saat ganti per_page ##
                per_page: perPage,
            },
            {
                preserveState: true,
                replace: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full flex-1 sm:max-w-xs">
                    <Input
                        type="search"
                        placeholder="Cari Order ID atau Nama..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* ## PERUBAHAN 6: Tambahkan Select/Dropdown untuk filter jenis donasi ## */}
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        <SelectItem value="zakat">Zakat</SelectItem>
                        <SelectItem value="infaq">Infaq</SelectItem>
                        <SelectItem value="sedekah">Sedekah</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Berhasil">Berhasil</SelectItem>
                        <SelectItem value="Menunggu Verifikasi">
                            Menunggu Verifikasi
                        </SelectItem>
                        <SelectItem value="Menunggu Pembayaran">
                            Menunggu Pembayaran
                        </SelectItem>
                        <SelectItem value="Gagal">Gagal</SelectItem>
                    </SelectContent>
                </Select>
                {/* ## PERUBAHAN 7: Update kondisi untuk menampilkan tombol Reset ## */}
                {(filters.search || filters.status || filters.type) && (
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
