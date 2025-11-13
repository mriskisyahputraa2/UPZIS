/**
 * @file ReportsTable.tsx
 * @description Komponen tabel untuk menampilkan data laporan penyaluran.
 *
 * @component ReportsTable
 * @param {object} props - Properti komponen.
 * @param {object} props.penyalurans - Objek paginasi data penyaluran.
 * @returns {JSX.Element} Komponen tabel laporan.
 */
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import React from 'react';
import AlokasiBadge from './AlokasiBadge';
import KategoriPenerimaBadge from './KategoriPenerimaBadge';

interface Penyaluran {
    id: number;
    amount: number;
    distribution_date: string;
    kategori_alokasi: string;
    permohonan_id: number;
    permohonan: {
        mustahik: {
            name: string;
        };
        kategori_pemohon: string;
    };
    admin: {
        name: string;
    };
}

interface ReportsTableProps {
    penyalurans: {
        data: Penyaluran[];
        from: number;
    };
}

const ReportsTable: React.FC<ReportsTableProps> = ({ penyalurans }) => {
    return (
        <div className="flex-1 overflow-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Penerima</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Sumber Dana</TableHead>
                        <TableHead>Tgl. Penyaluran</TableHead>
                        <TableHead>Dicatat Oleh</TableHead>
                        <TableHead className="w-[120px] text-right">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {penyalurans.data.length > 0 ? (
                        penyalurans.data.map((p, index) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">
                                    {penyalurans.from + index}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {p.permohonan.mustahik.name}
                                </TableCell>
                                <TableCell>
                                    <KategoriPenerimaBadge
                                        kategori={
                                            p.permohonan.kategori_pemohon
                                        }
                                    />
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {formatCurrency(p.amount)}
                                </TableCell>
                                <TableCell>
                                    <AlokasiBadge
                                        kategori={p.kategori_alokasi}
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatDate(p.distribution_date)}
                                </TableCell>
                                <TableCell>{p.admin.name}</TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={`/admin/permohonan/${p.permohonan_id}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="h-48 text-center"
                            >
                                <p className="font-semibold">
                                    Tidak ada data penyaluran.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Coba ubah filter atau catat penyaluran
                                    baru.
                                </p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReportsTable;
