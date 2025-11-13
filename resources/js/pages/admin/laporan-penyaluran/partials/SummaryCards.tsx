/**
 * @file SummaryCards.tsx
 * @description Komponen yang menampilkan dua kartu ringkasan: total dana dan jumlah penerima.
 *
 * @component SummaryCards
 * @param {object} props - Properti komponen.
 * @param {object} props.summary - Objek yang berisi data ringkasan.
 * @param {number} props.summary.totalAmount - Total dana yang disalurkan.
 * @param {number} props.summary.uniqueMustahik - Jumlah unik penerima bantuan.
 * @returns {JSX.Element} Grid yang berisi dua kartu ringkasan.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Banknote, Users } from 'lucide-react';
import React from 'react';

interface SummaryCardsProps {
    summary: {
        totalAmount: number;
        uniqueMustahik: number;
    };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
    return (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Dana Disalurkan
                    </CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(summary.totalAmount)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Jumlah Penerima Bantuan
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.uniqueMustahik} Orang
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SummaryCards;
