// resources/js/Pages/Admin/Mustahiks/Show.jsx (Tanpa Field Email)

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Copy,
    Edit,
    Home,
    // Mail, // <-- Dihapus
    Phone,
    User,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Detail Mustahik' },
];

const DetailItem = ({ icon: Icon, label, value, canCopy = false }) => {
    const copyToClipboard = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        toast.success(`"${label}" berhasil disalin ke clipboard!`);
    };

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-semibold text-foreground">
                        {value || '-'}
                    </p>
                </div>
            </div>
            {canCopy && value && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    aria-label={`Salin ${label}`}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default function Show({ mustahik }) {
    const getInitials = (name) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Mustahik: ${mustahik.name}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/mustahiks">
                            <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">
                                Detail Mustahik
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Data lengkap untuk "{mustahik.name}"
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full flex-shrink-0 gap-2 md:w-auto">
                        <Link href="/admin/mustahiks">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        <Link href={`/admin/mustahiks/${mustahik.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                    {/* Kolom Kiri: Kartu Profil */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden text-center">
                            <CardContent className="flex flex-col items-center gap-4 p-6">
                                <div className="h-48 w-full">
                                    {mustahik.photo ? (
                                        <img
                                            src={`/storage/${mustahik.photo}`}
                                            alt={mustahik.name}
                                            className="h-full w-full rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                                            <User className="h-24 w-24 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">
                                        {mustahik.name}
                                    </h2>
                                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>Mustahik</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Informasi Detail */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                {/* ## PERUBAHAN: Judul diubah menjadi lebih umum ## */}
                                <CardTitle>Informasi Detail</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                {/* ## PERUBAHAN: Nomor Telepon dipindah ke sini ## */}
                                <DetailItem
                                    icon={Phone}
                                    label="Nomor Telepon"
                                    value={mustahik.phone_number}
                                    canCopy
                                />
                                <DetailItem
                                    icon={User}
                                    label="Nomor Induk Kependudukan (NIK)"
                                    value={mustahik.nik}
                                    canCopy
                                />
                                <DetailItem
                                    icon={Users}
                                    label="Nomor Kartu Keluarga (KK)"
                                    value={mustahik.kk_number}
                                    canCopy
                                />
                                <DetailItem
                                    icon={Home}
                                    label="Alamat Lengkap"
                                    value={mustahik.address}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-6 flex w-full justify-end gap-2 md:hidden">
                    <Link href="/admin/mustahiks">
                        <Button variant="outline">Kembali</Button>
                    </Link>
                    <Link href={`/admin/mustahiks/${mustahik.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
