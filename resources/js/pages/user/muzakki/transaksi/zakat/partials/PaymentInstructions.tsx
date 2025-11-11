/**
 * @file PaymentInstructions.tsx
 * @description Komponen untuk menampilkan instruksi pembayaran berdasarkan metode yang dipilih.
 *
 * @component PaymentInstructions
 * @param {object} props - Properti komponen.
 * @param {string} props.method - Metode pembayaran (e.g., "Tunai", "DANA").
 * @param {object} props.details - Objek detail pembayaran dari backend.
 * @returns {JSX.Element | null} Komponen instruksi pembayaran atau null.
 */
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MapPin, Smartphone, User, Wallet } from 'lucide-react';
import React from 'react';

interface PaymentDetails {
    account: string;
    name: string;
    steps: string[];
}

interface PaymentInstructionsProps {
    method: string;
    details: PaymentDetails | null;
}

const PaymentDetailsDisplay: React.FC<PaymentInstructionsProps> = ({
    method,
    details,
}) => {
    if (!details) return null;

    if (method === 'Tunai') {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Wallet className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Setor ke:
                        </p>
                        <p className="font-semibold">{details.account}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Alamat:</p>
                        <p className="font-semibold">{details.name}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">Atas Nama:</p>
                    <p className="font-semibold">{details.name}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Smartphone className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                    <p className="text-sm text-muted-foreground">Nomor Akun:</p>
                    <p className="font-semibold">{details.account}</p>
                </div>
            </div>
        </div>
    );
};

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
    method,
    details,
}) => {
    if (!details) return null;

    return (
        <Card className="shadow-lg duration-500 animate-in fade-in">
            <CardHeader>
                <CardTitle>Instruksi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm">
                    <p>Silakan lakukan pembayaran ke akun berikut:</p>
                    <div className="rounded-md bg-muted/30 p-4">
                        <PaymentDetailsDisplay
                            method={method}
                            details={details}
                        />
                    </div>
                    <ol className="list-inside list-decimal space-y-1 pt-2 text-muted-foreground">
                        {details.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentInstructions;
