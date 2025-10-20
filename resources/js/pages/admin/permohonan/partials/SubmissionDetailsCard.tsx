import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calendar,
    Download,
    FileText,
    Hash,
    Home,
    Info,
    Users as KkIcon,
    Phone,
    ZoomIn,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

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

export default function SubmissionDetailsCard({ permohonan }) {
    return (
        <>
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
                    <DetailItem icon={KkIcon} label="No. Kartu Keluarga (KK)">
                        {permohonan.mustahik.kk_number}
                    </DetailItem>
                    <DetailItem icon={Phone} label="No. Telepon">
                        {permohonan.mustahik.phone_number}
                    </DetailItem>
                    <DetailItem icon={Home} label="Alamat">
                        {permohonan.mustahik.address}
                    </DetailItem>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Detail Pengajuan & Lampiran</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        <DetailItem icon={Info} label="Periode Pengajuan">
                            {permohonan.periode.name}
                        </DetailItem>
                        <DetailItem icon={Calendar} label="Tanggal Pengajuan">
                            {formatDate(permohonan.created_at)}
                        </DetailItem>
                    </div>
                    <div className="mt-6">
                        <h3 className="mb-4 text-lg font-medium">
                            Dokumen Lampiran
                        </h3>
                        {permohonan.dokumen ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <DocumentCard
                                    file_path={permohonan.dokumen.file_ktp}
                                    label="Kartu Tanda Penduduk (KTP)"
                                />
                                <DocumentCard
                                    file_path={permohonan.dokumen.file_kk}
                                    label="Kartu Keluarga"
                                />
                                <DocumentCard
                                    file_path={permohonan.dokumen.file_khs}
                                    label="Kartu Hasil Studi (KHS)"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen
                                            .file_surat_fakir_miskin
                                    }
                                    label="Surat Fakir/Miskin"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen
                                            .file_tidak_menerima_beasiswa
                                    }
                                    label="Surat Ket. Tdk Menerima Beasiswa"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen
                                            .file_surat_permohonan
                                    }
                                    label="Surat Permohonan"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen.file_rumah_depan
                                    }
                                    label="Rumah (Depan)"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen.file_rumah_belakang
                                    }
                                    label="Rumah (Belakang)"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen.file_rumah_kiri
                                    }
                                    label="Rumah (Kiri)"
                                />
                                <DocumentCard
                                    file_path={
                                        permohonan.dokumen.file_rumah_kanan
                                    }
                                    label="Rumah (Kanan)"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Tidak ada dokumen yang dilampirkan.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
