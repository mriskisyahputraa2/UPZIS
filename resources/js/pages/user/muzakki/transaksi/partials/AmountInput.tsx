/**
 * @file AmountInput.tsx
 * @description Komponen untuk memasukkan nominal donasi.
 * Termasuk input utama, format angka, dan tombol pilihan cepat.
 *
 * @component AmountInput
 * @param {object} props - Properti komponen.
 * @param {string | number} props.value - Nilai nominal saat ini.
 * @param {(value: string) => void} props.onAmountChange - Fungsi yang dipanggil saat nilai berubah.
 * @param {(value: number) => void} props.onQuickAmountClick - Fungsi untuk memilih nominal cepat.
 * @param {string} [props.error] - Pesan error validasi untuk ditampilkan.
 * @param {number[]} props.quickAmounts - Array nominal untuk pilihan cepat.
 * @param {string} [props.label] - Label untuk field input.
 * @returns {JSX.Element} Komponen input nominal.
 */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import React from 'react';

interface AmountInputProps {
    value: string | number;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onQuickAmountClick: (amount: number) => void;
    error?: string;
    quickAmounts: number[];
    label?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
    value,
    onAmountChange,
    onQuickAmountClick,
    error,
    quickAmounts,
    label = '1. Masukkan Nominal (IDR)',
}) => {
    return (
        <div className="space-y-3">
            <Label htmlFor="amount" className="text-base font-bold">
                {label}
            </Label>
            <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                    Rp
                </span>
                <Input
                    id="amount"
                    type="text"
                    value={new Intl.NumberFormat('id-ID').format(
                        Number(value) || 0,
                    )}
                    onChange={onAmountChange}
                    className="h-14 pr-4 pl-10 text-2xl font-bold"
                    placeholder="0"
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            <div className="flex flex-wrap gap-2 pt-2">
                {quickAmounts.map((qAmount) => (
                    <Button
                        key={qAmount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onQuickAmountClick(qAmount)}
                    >
                        {formatCurrency(qAmount)}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default AmountInput;
