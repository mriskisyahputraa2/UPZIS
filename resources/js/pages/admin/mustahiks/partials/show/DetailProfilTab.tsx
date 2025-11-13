import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Mustahik } from '@/types';
import {
    Briefcase,
    Home,
    PersonStanding,
    Phone,
    User,
    Users,
} from 'lucide-react';
import React from 'react';
import PersonalDetailItem from './PersonalDetailItem';

/**
 * @summary Properti untuk komponen DetailProfilTab.
 */
interface DetailProfilTabProps {
    /** Objek data mustahik. */
    mustahik: Mustahik;
    /** Apakah mustahik termasuk kategori mahasiswa. */
    isMahasiswa: boolean;
}

/**
 * @summary Komponen untuk menampilkan konten tab "Profil Detail".
 * @description Menampilkan informasi pribadi dan data ekonomi (jika bukan mahasiswa)
 *              dari seorang mustahik dalam bentuk kartu-kartu detail.
 * @param {DetailProfilTabProps} props - Properti untuk komponen.
 * @returns {JSX.Element} Konten tab profil detail.
 */
export default function DetailProfilTab({
    mustahik,
    isMahasiswa,
}: DetailProfilTabProps): JSX.Element {
    return (
        <>
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
                        <CardTitle>Data Ekonomi & Kondisi</CardTitle>
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
        </>
    );
}
