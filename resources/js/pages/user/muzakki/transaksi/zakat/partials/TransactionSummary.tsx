/**
 * @file TransactionSummary.tsx
 * @description Komponen untuk menampilkan ringkasan detail transaksi dalam sebuah card.
 *
 * @component TransactionSummary
 * @param {object} props - Properti komponen.
 * @param {object} props.transaksi - Objek data transaksi.
 * @returns {JSX.Element} Komponen ringkasan transaksi.
 */
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import React from 'react';
import StatusStepper from './StatusStepper';

interface TransactionSummaryProps {
    transaksi: {
        order_id: string;
        status: string;
        type: 'zakat' | 'infaq' | 'sedekah';
        formatted_date: string;
        formatted_time: string;
        payment_method: string;
        final_amount: number;
    };
}

const getDonationTypeName = (type: string) => {
    if (!type || type === 'zakat') return 'Zakat';
    return type.charAt(0).toUpperCase() + type.slice(1);
};

const getDonationTypeBadgeVariant = (type: string) => {
    if (type === 'zakat') return 'success';
    if (type === 'infaq') return 'info';
    return 'secondary';
};

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
    transaksi,
}) => {
    const donationTypeName = getDonationTypeName(transaksi.type);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Status Transaksi</CardTitle>
                <CardDescription>
                    Order ID: {transaksi.order_id}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <StatusStepper status={transaksi.status} />

                <div className="divide-y rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">
                            Jenis Donasi
                        </span>
                        <Badge
                            variant={getDonationTypeBadgeVariant(
                                transaksi.type,
                            )}
                        >
                            {donationTypeName}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Tanggal</span>
                        <span className="font-semibold">
                            {transaksi.formatted_date}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Waktu</span>
                        <span className="font-semibold">
                            {transaksi.formatted_time}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-muted-foreground">Metode</span>
                        <Badge variant="secondary">
                            {transaksi.payment_method}
                        </Badge>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-1 py-3 sm:flex-row sm:items-center">
                        <span className="text-muted-foreground">
                            Total Pembayaran
                        </span>
                        <span className="text-2xl font-bold">
                            {formatCurrency(transaksi.final_amount)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionSummary;
