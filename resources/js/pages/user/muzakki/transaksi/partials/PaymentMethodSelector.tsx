/**
 * @file PaymentMethodSelector.tsx
 * @description Komponen untuk memilih metode pembayaran dari beberapa pilihan.
 *
 * @component PaymentMethodSelector
 * @param {object} props - Properti komponen.
 * @param {string} props.selectedValue - Metode pembayaran yang sedang dipilih.
 * @param {(method: string) => void} props.onSelect - Fungsi yang dipanggil saat metode dipilih.
 * @param {string} [props.error] - Pesan error validasi untuk ditampilkan.
 * @returns {JSX.Element} Komponen pemilih metode pembayaran.
 */
import { Label } from '@/components/ui/label';
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import React from 'react';

interface PaymentMethodSelectorProps {
    selectedValue: string;
    onSelect: (method: string) => void;
    error?: string;
}

const paymentMethods = [
    { name: 'DANA', icon: Wallet },
    { name: 'GoPay', icon: CreditCard },
    { name: 'Tunai', icon: Landmark },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    selectedValue,
    onSelect,
    error,
}) => {
    return (
        <div className="space-y-3">
            <Label className="text-base font-bold">
                2. Pilih Metode Pembayaran
            </Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {paymentMethods.map((method) => (
                    <button
                        key={method.name}
                        type="button"
                        onClick={() => onSelect(method.name)}
                        className={`flex h-24 flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                            selectedValue === method.name
                                ? 'border-primary bg-primary/5'
                                : 'border-border'
                        }`}
                    >
                        <method.icon className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm font-semibold">
                            {method.name}
                        </span>
                    </button>
                ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default PaymentMethodSelector;
