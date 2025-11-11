/**
 * @file StatusStepper.tsx
 * @description Komponen visual untuk menampilkan progres status transaksi (stepper).
 * Menangani juga tampilan untuk status Gagal atau Kadaluarsa.
 *
 * @component StatusStepper
 * @param {object} props - Properti komponen.
 * @param {string} props.status - Status transaksi saat ini.
 * @returns {JSX.Element} Komponen status stepper.
 */
import { CheckCircle, Circle, Loader, XCircle } from 'lucide-react';
import React from 'react';

interface StatusStepperProps {
    status: string;
}

const StatusStepper: React.FC<StatusStepperProps> = ({ status }) => {
    if (status === 'Gagal' || status === 'Kadaluarsa') {
        return (
            <div className="flex items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <XCircle className="h-8 w-8 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Transaksi Gagal</h3>
                    <p className="text-sm">
                        {status === 'Kadaluarsa'
                            ? 'Waktu pembayaran untuk transaksi ini telah habis.'
                            : 'Pembayaran Anda gagal atau ditolak oleh admin.'}
                    </p>
                </div>
            </div>
        );
    }

    const steps = [
        { id: 'Menunggu Pembayaran', label: 'Lakukan Pembayaran' },
        { id: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi' },
        { id: 'Berhasil', label: 'Pembayaran Berhasil' },
    ];

    let currentStepIndex = steps.findIndex((step) => step.id === status);
    if (currentStepIndex < 0) {
        currentStepIndex = 0;
    }

    return (
        <div className="flex items-center justify-between text-sm">
            {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let icon = <Circle className="h-5 w-5 text-gray-300" />;
                if (isActive)
                    icon = <CheckCircle className="h-5 w-5 text-green-500" />;
                if (isCurrent && status !== 'Berhasil')
                    icon = (
                        <Loader className="h-5 w-5 animate-spin text-yellow-500" />
                    );

                return (
                    <div
                        key={step.id}
                        className="relative flex w-full flex-col items-center"
                    >
                        {index > 0 && (
                            <div
                                className={`absolute top-2.5 left-0 h-0.5 w-full -translate-x-1/2 ${
                                    isActive ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            ></div>
                        )}
                        <div className="relative z-10 rounded-full bg-white p-1">
                            {icon}
                        </div>
                        <p
                            className={`mt-2 text-center text-xs sm:text-sm ${
                                isActive
                                    ? 'font-bold text-primary'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {step.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default StatusStepper;
