import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FilePen, PlusCircle, Trash2 } from 'lucide-react';

// Tipe data untuk prop mustahiks (sesuaikan jika perlu)
interface Mustahik {
    id: number;
    name: string;
    nik: string;
    phone_number: string;
    address: string;
    photo: string | null; // Tambahkan photo
}

interface MustahiksPageProps extends PageProps {
    mustahiks: {
        data: Mustahik[];
        links: any[]; // Tipe untuk links dari paginator Laravel
        from: number;
    };
}

// Definisikan breadcrumbs untuk halaman ini
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
];

export default function Index({ mustahiks, flash }: MustahiksPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Mustahik" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Mustahik</h1>
                        <p className="text-gray-500">
                            Daftar semua calon penerima manfaat yang terdaftar.
                        </p>
                    </div>
                    <Link href="/admin/mustahiks/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Data
                        </Button>
                    </Link>
                </div>

                {/* Tampilkan notifikasi flash message jika ada */}
                {flash?.success && (
                    <div
                        className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700"
                        role="alert"
                    >
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No.</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama Lengkap</TableHead>
                                <TableHead>NIK</TableHead>
                                <TableHead>No. Telepon</TableHead>
                                <TableHead className="w-[100px] text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mustahiks.data.length > 0 ? (
                                mustahiks.data.map((mustahik, index) => (
                                    <TableRow key={mustahik.id}>
                                        <TableCell>
                                            {mustahiks.from + index}
                                        </TableCell>
                                        <TableCell>
                                            {mustahik.photo ? (
                                                <img
                                                    src={`/storage/${mustahik.photo}`}
                                                    alt={mustahik.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                    <span className="text-sm text-gray-500">
                                                        No Photo
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {mustahik.name}
                                        </TableCell>
                                        <TableCell>{mustahik.nik}</TableCell>
                                        <TableCell>
                                            {mustahik.phone_number || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/mustahiks/${mustahik.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <FilePen className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/admin/mustahiks/${mustahik.id}`}
                                                    method="delete"
                                                    as="button"
                                                    onBefore={() =>
                                                        confirm(
                                                            'Apakah Anda yakin ingin menghapus data ini?',
                                                        )
                                                    }
                                                >
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Tampilkan Paginasi */}
                <Pagination links={mustahiks.links} />
            </div>
        </AppLayout>
    );
}
