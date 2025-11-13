import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PenyaluranItem from '@/pages/admin/permohonan/partials/PenyaluranItem';
import { Permohonan } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';
import DocumentCard from './DocumentCard';

/**
 * @summary Badge status permohonan.
 */
const StatusBadge = ({
    status,
}: {
    status: 'Baru' | 'Diverifikasi' | 'Disetujui' | 'Ditolak';
}) => {
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

/**
 * @summary Properti untuk komponen RiwayatPermohonanTab.
 */
interface RiwayatPermohonanTabProps {
    permohonans: (Permohonan & {
        dokumen: any;
        penyalurans: any[];
        periode: { id: number; name: string };
    })[];
    setToEdit: (penyaluran: any) => void;
    setToDelete: (penyaluran: any) => void;
}

/**
 * @summary Komponen untuk menampilkan konten tab "Riwayat Permohonan".
 * @description Menampilkan daftar semua permohonan yang pernah diajukan oleh mustahik,
 *              lengkap dengan detail periode, status, dokumen, dan riwayat penyaluran dana.
 * @param {RiwayatPermohonanTabProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Konten tab riwayat permohonan.
 */
export default function RiwayatPermohonanTab({
    permohonans,
    setToEdit,
    setToDelete,
}: RiwayatPermohonanTabProps): JSX.Element {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Permohonan</CardTitle>
                <CardDescription>
                    Daftar semua permohonan bantuan yang pernah diajukan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {permohonans.length > 0 ? (
                    <div className="space-y-6">
                        {permohonans.map((permohonan) => (
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
                                            {permohonan.periode.name}
                                        </Link>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <StatusBadge
                                            status={permohonan.status as any}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 border-t pt-4">
                                    <p className="mb-2 text-sm font-semibold">
                                        Lampiran Dokumen:
                                    </p>
                                    {permohonan.dokumen ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                                                         {permohonan.kategori_pemohon ===
                                                                                            'mahasiswa' && (
                                                                                            <>
                                                                                                <DocumentCard
                                                                                                    filePath={
                                                                                                        permohonan.dokumen
                                                                                                            ?.file_ktp
                                                                                                    }
                                                                                                    label="KTP"
                                                                                                />
                                                                                                <DocumentCard
                                                                                                    filePath={
                                                                                                        permohonan.dokumen
                                                                                                            ?.file_kk
                                                                                                    }
                                                                                                    label="Kartu Keluarga"
                                                                                                />
                                                                                                <DocumentCard
                                                                                                    filePath={
                                                                                                        permohonan.dokumen
                                                                                                            ?.file_khs
                                                                                                    }
                                                                                                    label="KHS"
                                                                                                />
                                                                                                <DocumentCard
                                                                                                    filePath={
                                                                                                        permohonan.dokumen
                                                                                                            ?.file_surat_fakir_miskin
                                                                                                    }
                                                                                                    label="Surat Fakir/Miskin"
                                                                                                />
                                                                                                <DocumentCard
                                                                                                    filePath={
                                                                                                        permohonan.dokumen
                                                                                                            ?.file_tidak_menerima_beasiswa
                                                                                                    }
                                                                                                    label="Surat Ket. Tdk Menerima Beasiswa"
                                                                                                />
                                                                                                <DocumentCard
                                                                                                    filePath={
                                                                                                        permohonan.dokumen
                                                                                                            ?.file_surat_permohonan
                                                                                                    }
                                                                                                    label="Surat Permohonan"
                                                                                                />
                                                                                            </>
                                                                                        )}                                            {permohonan.kategori_pemohon ===
                                                'umum' && (
                                                <>
                                                    <DocumentCard
                                                        filePath={
                                                            permohonan.dokumen
                                                                ?.file_surat_fakir_miskin
                                                        }
                                                        label="SKTM"
                                                    />
                                                    <DocumentCard
                                                        filePath={
                                                            permohonan.dokumen
                                                                ?.file_rumah_depan
                                                        }
                                                        label="Rumah (Depan)"
                                                    />
                                                    <DocumentCard
                                                        filePath={
                                                            permohonan.dokumen
                                                                ?.file_rumah_belakang
                                                        }
                                                        label="Rumah (Belakang)"
                                                    />
                                                    <DocumentCard
                                                        filePath={
                                                            permohonan.dokumen
                                                                ?.file_rumah_kiri
                                                        }
                                                        label="Rumah (Kiri)"
                                                    />
                                                    <DocumentCard
                                                        filePath={
                                                            permohonan.dokumen
                                                                ?.file_rumah_kanan
                                                        }
                                                        label="Rumah (Kanan)"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Tidak ada dokumen yang dilampirkan.
                                        </p>
                                    )}

                                    {permohonan.penyalurans?.length > 0 && (
                                        <div className="mt-4 border-t pt-4">
                                            <p className="mb-2 text-sm font-semibold">
                                                Riwayat Penyaluran Dana:
                                            </p>
                                            <div className="overflow-hidden rounded-lg border">
                                                <ul className="divide-y divide-border">
                                                    {permohonan.penyalurans.map(
                                                        (p) => (
                                                            <PenyaluranItem
                                                                key={p.id}
                                                                penyaluran={p}
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
                        ))}
                    </div>
                ) : (
                    <p className="py-8 text-center text-muted-foreground">
                        Mustahik ini belum pernah mengajukan permohonan.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
