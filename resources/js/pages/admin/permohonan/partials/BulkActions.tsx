import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BulkActions({ selectedRows, onClearSelection }) {
    const [bulkStatus, setBulkStatus] = useState('');

    const handleBulkUpdate = () => {
        if (selectedRows.length === 0 || !bulkStatus) {
            toast.error(
                'Pilih minimal satu permohonan dan tentukan statusnya.',
            );
            return;
        }
        router.post(
            `/admin/permohonan/bulk-update-status`,
            {
                ids: selectedRows,
                status: bulkStatus,
            },
            {
                preserveState: false, // Lakukan reload penuh agar data sinkron
                onSuccess: () => onClearSelection(),
            },
        );
    };

    return (
        <div className="mb-4 flex flex-col items-start gap-2 rounded-lg border bg-slate-50 p-3 md:flex-row md:items-center dark:bg-slate-800/50">
            <span className="text-sm font-medium text-muted-foreground">
                {selectedRows.length} data dipilih
            </span>
            <Select onValueChange={setBulkStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Ubah Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Baru">Baru</SelectItem>
                    <SelectItem value="Diverifikasi">Diverifikasi</SelectItem>
                    <SelectItem value="Disetujui">Disetujui</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleBulkUpdate} size="sm">
                <CheckCircle className="mr-2 h-4 w-4" /> Terapkan
            </Button>
        </div>
    );
}
