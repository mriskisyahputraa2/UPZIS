import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function PenyaluranForm({
    permohonan,
    penyaluran = null,
    onOpenChange,
    onSuccess,
}) {
    const isEditMode = !!penyaluran;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        amount: penyaluran?.amount || '',
        distribution_date: penyaluran?.distribution_date || '',
        notes: penyaluran?.notes || '',
    });

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('amount', value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEditMode
            ? `/admin/penyaluran/${penyaluran.id}`
            : `/admin/permohonan/${permohonan.id}/penyaluran`;
        const action = isEditMode ? patch : post;

        action(url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
                onOpenChange(false);
            },
        });
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode
                            ? 'Edit Catatan Penyaluran'
                            : 'Form Catat Penyaluran'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Perbarui detail dana bantuan yang telah disalurkan.'
                            : 'Masukkan detail dana bantuan yang akan disalurkan.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Jumlah (Rp)</Label>
                        <Input
                            id="amount"
                            type="text"
                            value={
                                data.amount
                                    ? new Intl.NumberFormat('id-ID').format(
                                          data.amount,
                                      )
                                    : ''
                            }
                            onChange={handleAmountChange}
                            placeholder="Contoh: 500000"
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">
                                {errors.amount}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="distribution_date">
                            Tanggal Penyaluran
                        </Label>
                        <Input
                            id="distribution_date"
                            type="date"
                            value={data.distribution_date}
                            onChange={(e) =>
                                setData('distribution_date', e.target.value)
                            }
                        />
                        {errors.distribution_date && (
                            <p className="text-sm text-red-500">
                                {errors.distribution_date}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="break-words"
                            maxLength={255}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
