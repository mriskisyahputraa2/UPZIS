/**
 * @file DonationSummary.tsx
 * @description Komponen Alert untuk menampilkan ringkasan donasi sebelum submit.
 * Muncul ketika nominal dan metode pembayaran sudah dipilih.
 *
 * @component DonationSummary
 * @param {object} props - Properti komponen.
 * @param {string | number} props.amount - Nominal donasi.
 * @param {string} props.paymentMethod - Metode pembayaran yang dipilih.
 * @param {string} props.donationType - Jenis donasi (misal: "zakat", "infaq").
 * @returns {JSX.Element | null} Komponen ringkasan donasi atau null.
 */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import React from 'react';

interface DonationSummaryProps {
    amount: string | number;
    paymentMethod: string;
    donationType: 'zakat' | 'infaq' | 'sedekah';
}

const DonationSummary: React.FC<DonationSummaryProps> = ({
    amount,
    paymentMethod,
    donationType,
}) => {
    if (!amount || Number(amount) <= 0 || !paymentMethod) {
        return null;
    }

    const title =
        donationType === 'zakat'
            ? 'Ringkasan Pembayaran'
            : 'Ringkasan Donasi';
    const actionText = donationType === 'zakat' ? 'membayarkan zakat' : 'berdonasi';

    return (
        <Alert variant="default" className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">{title}</AlertTitle>
            <AlertDescription className="text-green-700">
                Anda akan {actionText} sebesar{' '}
                <strong>{formatCurrency(Number(amount))}</strong> melalui{' '}
                <strong>{paymentMethod}</strong>.
            </AlertDescription>
        </Alert>
    );
};

export default DonationSummary;
