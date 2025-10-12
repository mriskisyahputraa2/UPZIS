import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Copy,
    Download,
    FileText,
    HandCoins,
    Hash,
    Home,
    Info,
    Users as KkIcon,
    Phone,
    PlusCircle,
    User as UserIcon,
    ZoomIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Permohonan', href: '/admin/permohonan' },
    { title: 'Detail Permohonan' },
];

// Helper Functions
const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

// Komponen kecil untuk menampilkan item detail agar rapi
const DetailItem = ({ icon: Icon, label, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="flex items-center text-sm font-medium text-muted-foreground">
            <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{label}</span>
        </dt>
        <dd className="mt-1 font-semibold break-words text-foreground sm:col-span-2 sm:mt-0">
            {children || '-'}
        </dd>
    </div>
);

// Komponen untuk menampilkan kartu dokumen dengan preview dan tombol
const DocumentCard = ({ file_path, label }) => {
    if (!file_path) return null;

    const fileUrl = `/storage/${file_path}`;
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file_path);
    const isPdf = /\.pdf$/i.test(file_path);

    return (
        <div className="group relative overflow-hidden rounded-lg border">
            {isImage ? (
                <img
                    src={fileUrl}
                    alt={label}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                />
            ) : isPdf ? (
                <iframe
                    src={fileUrl}
                    className="h-40 w-full border-0"
                    title={label}
                    loading="lazy"
                ></iframe>
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
    const { flash } = usePage().props;
    const [isPenyaluranOpen, setIsPenyaluranOpen] = useState(false);

    // Form untuk update status permohonan
    const {
        data,
        setData,
        patch,
        processing: verifikasiProcessing,
        errors: verifikasiErrors,
    } = useForm({
        status: permohonan.status,
        notes_admin: permohonan.notes_admin || '',
    });

    // Form untuk mencatat penyaluran
    const {
        data: penyaluranData,
        setData: setPenyaluranData,
        post: postPenyaluran,
        processing: penyaluranProcessing,
        errors: penyaluranErrors,
        reset: resetPenyaluran,
    } = useForm({
        amount: '',
        distribution_date: '',
        notes: '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleVerifikasiSubmit = (e) => {
        e.preventDefault();
        patch(`/admin/permohonan/${permohonan.id}`, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Status permohonan berhasil diperbarui.'),
            onError: () => toast.error('Gagal memperbarui status.'),
        });
    };

    const handlePenyaluranSubmit = (e) => {
        e.preventDefault();
        postPenyaluran(`/admin/permohonan/${permohonan.id}/salurkan`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Data penyaluran berhasil dicatat.');
                setIsPenyaluranOpen(false);
                resetPenyaluran();
            },
        });
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`"${label}" berhasil disalin!`);
    };

    const totalDisalurkan = permohonan.penyalurans.reduce(
        (sum, p) => sum + parseFloat(p.amount),
        0,
    );

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
                        <Card className="sticky top-24 overflow-hidden text-center">
                            <CardContent className="flex flex-col items-center gap-4 p-6">
                                <div className="h-48 w-full">
                                    {permohonan.mustahik.photo ? (
                                        <img
                                            src={`/storage/${permohonan.mustahik.photo}`}
                                            alt={permohonan.mustahik.name}
                                            className="h-full w-full rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                                            <UserIcon className="h-24 w-24 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">
                                        {permohonan.mustahik.name}
                                    </h2>
                                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <UserIcon className="h-4 w-4" />
                                        <span>Calon Mustahik</span>
                                    </p>
                                </div>
                                <div className="w-full pt-4 text-left">
                                    <Label className="text-xs text-muted-foreground">
                                        Kode Pendaftaran
                                    </Label>
                                    <div className="mt-1 flex items-center justify-between rounded-md border bg-muted px-3 py-2">
                                        <code className="font-mono text-sm font-semibold text-primary">
                                            {permohonan.unique_code}
                                        </code>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() =>
                                                copyToClipboard(
                                                    permohonan.unique_code,
                                                    'Kode Pendaftaran',
                                                )
                                            }
                                        >
                                            <Copy className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Informasi Detail, Penyaluran, & Verifikasi */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pemohon</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <DetailItem
                                    icon={Hash}
                                    label="Nomor Induk Kependudukan (NIK)"
                                >
                                    {permohonan.mustahik.nik}
                                </DetailItem>
                                <DetailItem
                                    icon={KkIcon}
                                    label="No. Kartu Keluarga (KK)"
                                >
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
                                        {formatDate(permohonan.created_at)}
                                    </DetailItem>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <DocumentCard
                                        file_path={permohonan.file_ktp}
                                        label="Kartu Tanda Penduduk (KTP)"
                                    />
                                    <DocumentCard
                                        file_path={permohonan.file_kk}
                                        label="Kartu Keluarga"
                                    />
                                    <DocumentCard
                                        file_path={permohonan.file_khs}
                                        label="Kartu Hasil Studi (KHS)"
                                    />
                                    <DocumentCard
                                        file_path={
                                            permohonan.file_surat_fakir_miskin
                                        }
                                        label="Surat Fakir/Miskin"
                                    />
                                    <DocumentCard
                                        file_path={
                                            permohonan.file_tidak_menerima_beasiswa
                                        }
                                        label="Surat Ket. Tdk Menerima Beasiswa"
                                    />
                                    <DocumentCard
                                        file_path={
                                            permohonan.file_surat_permohonan
                                        }
                                        label="Surat Permohonan"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kartu Riwayat Penyaluran */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>
                                        Riwayat Penyaluran Dana
                                    </CardTitle>
                                    <CardDescription>
                                        Daftar bantuan yang telah diberikan
                                        untuk permohonan ini.
                                    </CardDescription>
                                </div>
                                {permohonan.status === 'Disetujui' && (
                                    <Dialog
                                        open={isPenyaluranOpen}
                                        onOpenChange={setIsPenyaluranOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Catat Penyaluran
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <form
                                                onSubmit={
                                                    handlePenyaluranSubmit
                                                }
                                            >
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Form Catat Penyaluran
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Masukkan detail dana
                                                        bantuan yang disalurkan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount">
                                                            Jumlah (Rp)
                                                        </Label>
                                                        <Input
                                                            id="amount"
                                                            type="number"
                                                            value={
                                                                penyaluranData.amount
                                                            }
                                                            onChange={(e) =>
                                                                setPenyaluranData(
                                                                    'amount',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {penyaluranErrors.amount && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    penyaluranErrors.amount
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="distribution_date">
                                                            Tanggal Penyaluran
                                                        </Label>
                                                        <Input
                                                            id="distribution_date"
                                                            type="date"
                                                            value={
                                                                penyaluranData.distribution_date
                                                            }
                                                            onChange={(e) =>
                                                                setPenyaluranData(
                                                                    'distribution_date',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {penyaluranErrors.distribution_date && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    penyaluranErrors.distribution_date
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="notes">
                                                            Catatan (Opsional)
                                                        </Label>
                                                        <Textarea
                                                            id="notes"
                                                            value={
                                                                penyaluranData.notes
                                                            }
                                                            onChange={(e) =>
                                                                setPenyaluranData(
                                                                    'notes',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            penyaluranProcessing
                                                        }
                                                    >
                                                        {penyaluranProcessing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan Data'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </CardHeader>
                            <CardContent>
                                {permohonan.penyalurans.length > 0 ? (
                                    <ul className="divide-y">
                                        {permohonan.penyalurans.map((p) => (
                                            <li key={p.id} className="py-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-lg font-bold">
                                                            {formatCurrency(
                                                                p.amount,
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Dicatat oleh:{' '}
                                                            {p.admin.name}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm">
                                                            {formatDate(
                                                                p.distribution_date,
                                                            )}
                                                        </p>
                                                        {p.notes && (
                                                            <p className="text-xs text-muted-foreground italic">
                                                                "{p.notes}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-8 text-center">
                                        <HandCoins className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                        <p className="mt-4 text-muted-foreground">
                                            Belum ada data penyaluran yang
                                            dicatat.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            {totalDisalurkan > 0 && (
                                <CardFooter className="flex justify-between bg-muted/50 p-4 font-bold">
                                    <span>Total Disalurkan</span>
                                    <span>
                                        {formatCurrency(totalDisalurkan)}
                                    </span>
                                </CardFooter>
                            )}
                        </Card>

                        <form onSubmit={handleVerifikasiSubmit}>
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
                                        {verifikasiErrors.status && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {verifikasiErrors.status}
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
                                        {verifikasiErrors.notes_admin && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {verifikasiErrors.notes_admin}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        disabled={verifikasiProcessing}
                                        className="w-full"
                                    >
                                        {verifikasiProcessing
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
