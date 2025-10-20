import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    ArrowLeft,
    Bookmark,
    Calendar,
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
import { toast } from 'sonner';
import PenyaluranItem from '../permohonan/partials/PenyaluranItem';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Mustahik', href: '/admin/mustahiks' },
    { title: 'Detail Mustahik' },
];

const PersonalDetailItem = ({ icon: Icon, label, value, canCopy = false }) => {
    const copyToClipboard = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        toast.success(`"${label}" berhasil disalin!`);
    };
    return (
        <div className="flex items-start justify-between py-3">
            {' '}
            <div className="flex items-start gap-4">
                {' '}
                <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />{' '}
                <div>
                    {' '}
                    <p className="text-sm text-muted-foreground">
                        {label}
                    </p>{' '}
                    <p className="font-semibold break-all text-foreground">
                        {value || '-'}
                    </p>{' '}
                </div>{' '}
            </div>{' '}
            {canCopy && value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={copyToClipboard}
                    aria-label={`Salin ${label}`}
                >
                    {' '}
                    <Copy className="h-4 w-4" />{' '}
                </Button>
            )}{' '}
        </div>
    );
};

const DocumentCard = ({ file_path, label }) => {
    if (!file_path) return null;
    const fileUrl = `/storage/${file_path}`;
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file_path);
    const isPdf = /\.pdf$/i.test(file_path);
    return (
        <div className="group relative overflow-hidden rounded-lg border">
            {' '}
            {isImage ? (
                <img
                    src={fileUrl}
                    alt={label}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                />
            ) : isPdf ? (
                <iframe
                    src={fileUrl}
                    className="h-28 w-full border-0"
                    title={label}
                    loading="lazy"
                ></iframe>
            ) : (
                <div className="flex h-28 w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                    {' '}
                    <FileText className="h-8 w-8 text-gray-400" />{' '}
                    <span className="mt-2 text-xs text-gray-500">
                        File Dokumen
                    </span>{' '}
                </div>
            )}{' '}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {' '}
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Lihat"
                >
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </a>{' '}
                <a href={fileUrl} download title="Unduh">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                    </Button>
                </a>{' '}
            </div>{' '}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="truncate text-xs font-semibold text-white">
                    {label}
                </p>
            </div>{' '}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let variant;
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
        default:
            variant = 'secondary';
    }
    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
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
                    <div className="hidden w-full flex-shrink-0 gap-2 md:flex md:w-auto">
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
                                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>Mustahik</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Informasi Detail dengan TAB */}
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
                                            icon={Bookmark}
                                            label="Kategori Mustahik"
                                            value={
                                                <Badge
                                                    variant={
                                                        mustahik.permohonans[0]
                                                            ?.kategori_pemohon ===
                                                        'mahasiswa'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {mustahik.permohonans[0]
                                                        ?.kategori_pemohon ===
                                                    'mahasiswa'
                                                        ? 'Mahasiswa'
                                                        : mustahik
                                                                .permohonans[0]
                                                                ?.kategori_pemohon ===
                                                            'umum'
                                                          ? 'Fakir/Miskin'
                                                          : '-'}
                                                </Badge>
                                            }
                                        />

                                        <PersonalDetailItem
                                            icon={Home}
                                            label="Alamat Lengkap"
                                            value={mustahik.address}
                                        />
                                    </CardContent>
                                </Card>
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
                                                                <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>
                                                                        Tanggal
                                                                        Pengajuan:{' '}
                                                                        {format(
                                                                            new Date(
                                                                                permohonan.created_at,
                                                                            ),
                                                                            'dd MMMM yyyy',
                                                                            {
                                                                                locale: id,
                                                                            },
                                                                        )}
                                                                    </span>
                                                                </p>
                                                                <p className="text-sm font-semibold">
                                                                    Lampiran
                                                                    Dokumen:
                                                                </p>

                                                                {permohonan.dokumen ? (
                                                                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
                                                                                                showActions={
                                                                                                    false
                                                                                                }
                                                                                                className="px-4"
                                                                                            />
                                                                                        ),
                                                                                    )}
                                                                                </ul>
                                                                                <div className="flex justify-between rounded-b-lg bg-muted/50 px-4 py-3 text-lg font-bold">
                                                                                    <span>
                                                                                        Total
                                                                                        Disalurkan
                                                                                    </span>
                                                                                    <span className="text-green-600">
                                                                                        {new Intl.NumberFormat(
                                                                                            'id-ID',
                                                                                            {
                                                                                                style: 'currency',
                                                                                                currency:
                                                                                                    'IDR',
                                                                                                minimumFractionDigits: 0,
                                                                                            },
                                                                                        ).format(
                                                                                            permohonan.penyalurans.reduce(
                                                                                                (
                                                                                                    sum,
                                                                                                    p,
                                                                                                ) =>
                                                                                                    sum +
                                                                                                    parseFloat(
                                                                                                        p.amount,
                                                                                                    ),
                                                                                                0,
                                                                                            ),
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                {permohonan.notes_admin && (
                                                                    <div className="mt-4">
                                                                        <p className="text-sm font-semibold">
                                                                            Catatan
                                                                            Admin:
                                                                        </p>
                                                                        <div className="mt-1 rounded-md border bg-gray-50 p-3 text-sm text-muted-foreground dark:bg-gray-800">
                                                                            <p className="whitespace-pre-wrap">
                                                                                {
                                                                                    permohonan.notes_admin
                                                                                }
                                                                            </p>
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
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
