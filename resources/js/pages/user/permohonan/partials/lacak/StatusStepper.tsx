import { CheckCircle, Circle, Loader, XCircle } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} Step
 * @property {string} name - Nama langkah (e.g., 'Baru', 'Diverifikasi').
 * @property {React.ElementType} icon - Ikon untuk langkah tersebut.
 * @property {boolean} [isFinal] - Apakah ini langkah terakhir.
 * @property {boolean} [isRejected] - Apakah ini langkah penolakan.
 */

/**
 * @typedef {object} StatusStepperProps
 * @property {'Baru' | 'Diverifikasi' | 'Disetujui' | 'Ditolak'} currentStatus - Status permohonan saat ini.
 */

/**
 * Komponen visual untuk menampilkan progres status permohonan secara vertikal.
 * Menyorot langkah saat ini dan yang sudah selesai.
 *
 * @param {StatusStepperProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const StatusStepper = ({ currentStatus }) => {
    /** @type {Step[]} */
    const steps = [
        { name: 'Baru', icon: Circle },
        { name: 'Diverifikasi', icon: Circle },
        { name: 'Disetujui', icon: CheckCircle, isFinal: true },
        { name: 'Ditolak', icon: XCircle, isFinal: true, isRejected: true },
    ];

    const currentStepIndex = steps.findIndex(
        (step) => step.name === currentStatus,
    );
    const isRejected = currentStatus === 'Ditolak';

    return (
        <div className="space-y-4">
            {steps.map((step, index) => {
                if (isRejected && step.name === 'Disetujui') return null;
                if (!isRejected && step.isRejected) return null;

                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let Icon = isActive ? CheckCircle : step.icon;
                let iconColor = isActive
                    ? isRejected
                        ? 'text-red-500'
                        : 'text-green-500'
                    : 'text-gray-400';
                let textColor = isActive
                    ? isRejected
                        ? 'text-red-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    : 'text-gray-500';

                if (isCurrent && !step.isFinal) {
                    Icon = Loader;
                    iconColor = 'text-yellow-500';
                    textColor = 'text-yellow-600 font-semibold';
                }
                if (isCurrent && currentStatus === 'Ditolak') Icon = XCircle;

                return (
                    <div key={step.name} className="flex items-center gap-4">
                        <Icon
                            className={`h-6 w-6 flex-shrink-0 ${iconColor} ${
                                isCurrent && !step.isFinal ? 'animate-spin' : ''
                            }`}
                        />
                        <span className={`font-medium ${textColor}`}>
                            {step.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default StatusStepper;
