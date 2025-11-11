/**
 * @file StatusAlerts.tsx
 * @description Komponen untuk menampilkan alert berdasarkan status transaksi.
 * Menangani status 'Menunggu Verifikasi', 'Berhasil', 'Gagal', dan 'Kadaluarsa'.
 *
 * @component StatusAlerts
 * @param {object} props - Properti komponen.
 * @param {string} props.status - Status transaksi saat ini.
 * @param {string} props.donationTypeName - Nama jenis donasi yang diformat.
 * @returns {JSX.Element | null} Komponen alert status atau null.
 */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import React from 'react';

interface StatusAlertsProps {
    status: string;
    donationTypeName: string;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({
    status,
    donationTypeName,
}) => {
    switch (status) {
        case 'Menunggu Verifikasi':
            return (
                <Alert
                    variant="default"
                    className="border-yellow-200 bg-yellow-50 text-yellow-800 shadow-lg"
                >
                    <Loader className="h-4 w-4 animate-spin text-yellow-600" />
                    <AlertTitle className="font-bold">
                        Menunggu Verifikasi
                    </AlertTitle>
                    <AlertDescription>
                        Terima kasih, bukti pembayaran Anda telah kami terima
                        dan akan segera diverifikasi oleh tim kami.
                    </AlertDescription>
                </Alert>
            );
        case 'Berhasil':
            return (
                <Alert
                    variant="default"
                    className="border-green-200 bg-green-50 text-green-800 shadow-lg"
                >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="font-bold">
                        Pembayaran Berhasil
                    </AlertTitle>
                    <AlertDescription>
                        Terima kasih, {donationTypeName.toLowerCase()} Anda
                        telah kami terima dan akan segera kami salurkan.
                    </AlertDescription>
                </Alert>
            );
        case 'Gagal':
        case 'Kadaluarsa':
            return (
                <Alert className="border-red-500/50 bg-red-50 shadow-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="font-bold text-red-900">
                        Transaksi Gagal
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                        {status === 'Kadaluarsa'
                            ? 'Waktu pembayaran telah habis. Anda bisa membuat transaksi baru jika ingin melanjutkan.'
                            : 'Pembayaran Anda gagal atau ditolak. Silakan coba lagi dengan membuat transaksi baru.'}
                    </AlertDescription>
                </Alert>
            );
        default:
            return null;
    }
};

export default StatusAlerts;
