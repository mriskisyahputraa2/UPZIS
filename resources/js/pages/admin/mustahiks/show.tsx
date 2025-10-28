import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Copy,
    Download,
    Edit,
    FileText,
    Home,
    PersonStanding,
    Phone,
    User,
    Users,
    ZoomIn,
} from 'lucide-react';
import { useState } from 'react';
import PenyaluranForm from '../permohonan/partials/PenyaluranForm';
import PenyaluranItem from '../permohonan/partials/PenyaluranItem';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Detail Mustahik' },
];

const PersonalDetailItem = ({
    icon: Icon,
    label,
    value,
    children,
    canCopy = false,
}) => {
    const copyToClipboard = () => {
        if (!value) return;
        navigator.clipboard.writeText(String(value));
        toast.success(`"${label}" berhasil disalin!`);
    };
    return (
        <div className="flex items-start justify-between py-3">
            <div className="flex items-start gap-4">
                <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="font-semibold break-all text-foreground">
                        {children || value || '-'}
                    </div>
                </div>
            </div>
            {canCopy && value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={copyToClipboard}
                    aria-label={`Salin ${label}`}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

const DocumentCard = ({ file_path, label }) => {
    if (!file_path) return null;
    const fileUrl = `/storage/${file_path}`;
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file_path);

    return (
        <div className="group relative overflow-hidden rounded-lg border">
            {isImage ? (
                <img
                    src={fileUrl}
                    alt={label}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="flex h-28 w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-xs text-gray-500">
                        File Dokumen
                    </span>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Lihat"
                >
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </a>
                <a href={fileUrl} download title="Unduh">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                    </Button>
                </a>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="truncate text-xs font-semibold text-white">
                    {label}
                </p>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let variant: 'info' | 'warning' | 'success' | 'destructive' | 'secondary' =
        'secondary';
    switch (status) {
        case 'Baru':
            variant = 'info';
            break;
        case 'Diverifikasi':
            variant = 'warning';
            break;
        case 'Disetujui':
            variant = 'success';
            break;
        case 'Ditolak':
            variant = 'destructive';
            break;
    }
    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    );
};

export default function Show({ mustahik, availableFunds }) {
    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const latestPermohonan = mustahik.permohonans[0];
    const isMahasiswa = latestPermohonan?.kategori_pemohon === 'mahasiswa';

    const handleDeletePenyaluran = () => {
        if (toDelete) {
            router.delete(`/admin/penyaluran/${toDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => setToDelete(null),
            });
        }
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
                    <div className="hidden w-full flex-shrink-0 gap-2 md:flex md:w-auto">
                        <Link href="/admin/mustahiks">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        <Link href={`/admin/mustahiks/${mustahik.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" /> Edit Data
                                Induk
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden text-center">
                            <CardContent className="flex flex-col items-center gap-4 p-6">
                                <div className="h-48 w-full">
                                    {mustahik.photo ? (
                                        <img
                                            src={`/storage/${mustahik.photo}`}
                                            alt={mustahik.name}
                                            className="h-full w-full rounded-xl object-cover"
                                            loading="lazy"
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
                                    <Badge
                                        variant={
                                            isMahasiswa
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {isMahasiswa
                                            ? 'Mahasiswa'
                                            : 'Fakir/Miskin'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Tabs defaultValue="profil" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profil">
                                    Profil Detail
                                </TabsTrigger>
                                <TabsTrigger value="riwayat">
                                    Riwayat Permohonan
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profil" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Pribadi</CardTitle>
                                    </CardHeader>
                                    <CardContent className="divide-y">
                                        <PersonalDetailItem
                                            icon={User}
                                            label="Nomor Induk Kependudukan (NIK)"
                                            value={mustahik.nik}
                                            canCopy
                                        />
                                        <PersonalDetailItem
                                            icon={Users}
                                            label="Nomor Kartu Keluarga (KK)"
                                            value={mustahik.kk_number}
                                            canCopy
                                        />
                                        <PersonalDetailItem
                                            icon={Phone}
                                            label="Nomor Telepon"
                                            value={mustahik.phone_number}
                                            canCopy
                                        />
                                        <PersonalDetailItem
                                            icon={PersonStanding}
                                            label="Jenis Kelamin"
                                            value={mustahik.jenis_kelamin}
                                        />
                                        <PersonalDetailItem
                                            icon={Home}
                                            label="Alamat Lengkap"
                                            value={mustahik.address}
                                        />
                                    </CardContent>
                                </Card>

                                {!isMahasiswa && (
                                    <Card className="mt-6">
                                        <CardHeader>
                                            <CardTitle>
                                                Data Ekonomi & Kondisi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="divide-y">
                                            <PersonalDetailItem
                                                icon={Briefcase}
                                                label="Pekerjaan"
                                                value={mustahik.pekerjaan}
                                            />
                                            <PersonalDetailItem
                                                icon={Users}
                                                label="Jumlah Tanggungan"
                                                value={`${mustahik.jumlah_tanggungan} Orang`}
                                            />
                                            <PersonalDetailItem
                                                icon={Home}
                                                label="Status Kepemilikan Rumah"
                                                value={mustahik.status_rumah}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="riwayat" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Riwayat Permohonan
                                        </CardTitle>
                                        <CardDescription>
                                            Daftar semua permohonan bantuan yang
                                            pernah diajukan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {mustahik.permohonans.length > 0 ? (
                                            <div className="space-y-6">
                                                {mustahik.permohonans.map(
                                                    (permohonan) => (
                                                        <div
                                                            key={permohonan.id}
                                                            className="rounded-lg border p-4"
                                                        >
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Periode
                                                                    </p>
                                                                    <Link
                                                                        href={`/admin/permohonan?periode_id=${permohonan.periode.id}`}
                                                                        className="font-bold text-primary hover:underline"
                                                                    >
                                                                        {
                                                                            permohonan
                                                                                .periode
                                                                                .name
                                                                        }
                                                                    </Link>
                                                                </div>
                                                                <div className="text-left sm:text-right">
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Status
                                                                    </p>
                                                                    <StatusBadge
                                                                        status={
                                                                            permohonan.status
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 border-t pt-4">
                                                                <p className="mb-2 text-sm font-semibold">
                                                                    Lampiran
                                                                    Dokumen:
                                                                </p>
                                                                {permohonan.dokumen ? (
                                                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                                        {permohonan.kategori_pemohon ===
                                                                            'mahasiswa' && (
                                                                            <>
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_ktp
                                                                                    }
                                                                                    label="KTP"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_kk
                                                                                    }
                                                                                    label="Kartu Keluarga"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_khs
                                                                                    }
                                                                                    label="KHS"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_surat_fakir_miskin
                                                                                    }
                                                                                    label="Surat Fakir/Miskin"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_tidak_menerima_beasiswa
                                                                                    }
                                                                                    label="Surat Ket. Tdk Menerima Beasiswa"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_surat_permohonan
                                                                                    }
                                                                                    label="Surat Permohonan"
                                                                                />
                                                                            </>
                                                                        )}
                                                                        {permohonan.kategori_pemohon ===
                                                                            'umum' && (
                                                                            <>
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_surat_fakir_miskin
                                                                                    }
                                                                                    label="SKTM"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_rumah_depan
                                                                                    }
                                                                                    label="Rumah (Depan)"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_rumah_belakang
                                                                                    }
                                                                                    label="Rumah (Belakang)"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_rumah_kiri
                                                                                    }
                                                                                    label="Rumah (Kiri)"
                                                                                />
                                                                                <DocumentCard
                                                                                    file_path={
                                                                                        permohonan
                                                                                            .dokumen
                                                                                            ?.file_rumah_kanan
                                                                                    }
                                                                                    label="Rumah (Kanan)"
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                                        Tidak
                                                                        ada
                                                                        dokumen
                                                                        yang
                                                                        dilampirkan.
                                                                    </p>
                                                                )}

                                                                {permohonan.penyalurans &&
                                                                    permohonan
                                                                        .penyalurans
                                                                        .length >
                                                                        0 && (
                                                                        <div className="mt-4 border-t pt-4">
                                                                            <p className="mb-2 text-sm font-semibold">
                                                                                Riwayat
                                                                                Penyaluran
                                                                                Dana:
                                                                            </p>
                                                                            <div className="overflow-hidden rounded-lg border">
                                                                                <ul className="divide-y divide-border">
                                                                                    {permohonan.penyalurans.map(
                                                                                        (
                                                                                            p,
                                                                                        ) => (
                                                                                            <PenyaluranItem
                                                                                                key={
                                                                                                    p.id
                                                                                                }
                                                                                                penyaluran={
                                                                                                    p
                                                                                                }
                                                                                                onEdit={
                                                                                                    setToEdit
                                                                                                }
                                                                                                onDelete={
                                                                                                    setToDelete
                                                                                                }
                                                                                                className="px-4"
                                                                                            />
                                                                                        ),
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="py-8 text-center text-muted-foreground">
                                                Mustahik ini belum pernah
                                                mengajukan permohonan.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <div className="mt-6 flex w-full justify-end gap-2 md:hidden">
                    <Link href="/admin/mustahiks">
                        <Button variant="outline">Kembali</Button>
                    </Link>
                    <Link href={`/admin/mustahiks/${mustahik.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" /> Edit Data Induk
                        </Button>
                    </Link>
                </div>
            </div>

            <Dialog open={!!toEdit} onOpenChange={() => setToEdit(null)}>
                {toEdit && (
                    <PenyaluranForm
                        permohonan={mustahik.permohonans.find(
                            (p) => p.id === toEdit.permohonan_id,
                        )}
                        penyaluran={toEdit}
                        availableFunds={availableFunds}
                        onOpenChange={() => setToEdit(null)}
                        onSuccess={() => setToEdit(null)}
                    />
                )}
            </Dialog>
        </AppLayout>
    );
}
