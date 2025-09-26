import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Download,
    FileText,
    Hash,
    Home,
    Info,
    Users as KkIcon,
    Phone,
    User,
    ZoomIn,
} from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan', href: '/admin/permohonan' },
    { title: 'Detail Permohonan' },
];

// Komponen kecil untuk menampilkan item detail agar rapi
const DetailItem = ({ icon: Icon, label, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="flex items-center text-sm font-medium text-muted-foreground">
            <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{label}</span>
        </dt>
        <dd className="mt-1 font-semibold text-foreground sm:col-span-2 sm:mt-0">
            {children}
        </dd>
    </div>
);

// Komponen untuk menampilkan kartu dokumen dengan preview dan tombol
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
                    className="h-40 w-full object-cover"
                />
            ) : (
                <div className="flex h-40 w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <FileText className="h-12 w-12 text-gray-400" />
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
                <p className="text-xs font-semibold text-white">{label}</p>
            </div>
        </div>
    );
};

export default function Show({ permohonan }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: permohonan.status,
        notes_admin: permohonan.notes_admin || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(`/admin/permohonan/${permohonan.id}`, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Status permohonan berhasil diperbarui.'),
            onError: () => toast.error('Gagal memperbarui status.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Permohonan - ${permohonan.mustahik.name}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/permohonan">
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
                                Detail Permohonan
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Verifikasi data untuk "
                                {permohonan.mustahik.name}"
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                    {/* Kolom Kiri: Kartu Profil Pemohon */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden text-center">
                            <CardContent className="flex flex-col items-center gap-4 p-6">
                                <div className="h-48 w-full">
                                    {permohonan.photo ? (
                                        <img
                                            src={`/storage/${permohonan.photo}`}
                                            alt={permohonan.mustahik.name}
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
                                        {permohonan.mustahik.name}
                                    </h2>
                                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>Calon Mustahik</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Informasi Detail & Verifikasi */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pemohon</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <DetailItem icon={Hash} label="NIK">
                                    {permohonan.mustahik.nik}
                                </DetailItem>
                                <DetailItem icon={KkIcon} label="No. KK">
                                    {permohonan.mustahik.kk_number || '-'}
                                </DetailItem>
                                <DetailItem icon={Phone} label="No. Telepon">
                                    {permohonan.mustahik.phone_number || '-'}
                                </DetailItem>
                                <DetailItem icon={Home} label="Alamat">
                                    {permohonan.mustahik.address || '-'}
                                </DetailItem>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Detail Pengajuan & Lampiran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y">
                                    <DetailItem
                                        icon={Info}
                                        label="Periode Pengajuan"
                                    >
                                        {permohonan.periode.name}
                                    </DetailItem>
                                    <DetailItem
                                        icon={Calendar}
                                        label="Tanggal Pengajuan"
                                    >
                                        {new Date(
                                            permohonan.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </DetailItem>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <DocumentCard
                                        file_path={permohonan.file_ktp}
                                        label="KTP"
                                    />
                                    <DocumentCard
                                        file_path={permohonan.file_kk}
                                        label="Kartu Keluarga"
                                    />
                                    <DocumentCard
                                        file_path={permohonan.file_khs}
                                        label="KHS"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Verifikasi Permohonan</CardTitle>
                                    <CardDescription>
                                        Ubah status dan berikan catatan jika
                                        perlu.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">
                                            Status Permohonan
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData('status', value)
                                            }
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Baru">
                                                    Baru
                                                </SelectItem>
                                                <SelectItem value="Diverifikasi">
                                                    Diverifikasi
                                                </SelectItem>
                                                <SelectItem value="Disetujui">
                                                    Disetujui
                                                </SelectItem>
                                                <SelectItem value="Ditolak">
                                                    Ditolak
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="notes_admin">
                                            Catatan Admin (Internal)
                                        </Label>
                                        <Textarea
                                            id="notes_admin"
                                            value={data.notes_admin}
                                            onChange={(e) =>
                                                setData(
                                                    'notes_admin',
                                                    e.target.value,
                                                )
                                            }
                                            rows={5}
                                            placeholder="Tulis hasil verifikasi atau alasan perubahan status di sini..."
                                        />
                                        {errors.notes_admin && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.notes_admin}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
