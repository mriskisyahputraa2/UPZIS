import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';
import StatusStepper from './StatusStepper';

/**
 * @typedef {object} Permohonan
 * @property {string} status - Status permohonan.
 * @property {string | null} notes_admin - Catatan dari admin.
 * @property {object} mustahik
 * @property {string} mustahik.name - Nama pemohon.
 * @property {object} periode
 * @property {string} periode.name - Nama periode permohonan.
 */

/**
 * @typedef {object} SearchResultProps
 * @property {Permohonan} permohonan - Objek data permohonan yang ditemukan.
 */

/**
 * Komponen untuk menampilkan hasil pencarian status permohonan yang berhasil ditemukan.
 * Menampilkan nama pemohon, periode, progres status, dan catatan dari admin.
 *
 * @param {SearchResultProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const SearchResult = ({ permohonan }) => {
    return (
        <Card className="duration-500 animate-in fade-in">
            <CardHeader>
                <CardTitle>Hasil Ditemukan</CardTitle>
                <CardDescription>
                    Status terakhir untuk permohonan atas nama{' '}
                    <strong>{permohonan.mustahik.name}</strong> pada periode{' '}
                    <strong>{permohonan.periode.name}</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <StatusStepper currentStatus={permohonan.status} />
                {permohonan.notes_admin && (
                    <div className="mt-6 rounded-lg border bg-gray-50 p-4">
                        <h4 className="font-semibold">Catatan dari Admin:</h4>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                            {permohonan.notes_admin}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SearchResult;
