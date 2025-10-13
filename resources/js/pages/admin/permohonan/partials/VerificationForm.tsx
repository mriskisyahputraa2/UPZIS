import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function VerificationForm({ permohonan }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: permohonan.status,
        notes_admin: permohonan.notes_admin || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(`/admin/permohonan/${permohonan.id}`, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Status permohonan berhasil diperbarui.'),
            onError: () => toast.error('Gagal memperbarui status.'),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Verifikasi Permohonan</CardTitle>
                    <CardDescription>
                        Ubah status dan berikan catatan jika perlu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="status">Status Permohonan</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Baru">Baru</SelectItem>
                                <SelectItem value="Diverifikasi">
                                    Diverifikasi
                                </SelectItem>
                                <SelectItem value="Disetujui">
                                    Disetujui
                                </SelectItem>
                                <SelectItem value="Ditolak">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.status}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="notes_admin">
                            Catatan Admin (Internal)
                        </Label>
                        <Textarea
                            id="notes_admin"
                            value={data.notes_admin}
                            onChange={(e) =>
                                setData('notes_admin', e.target.value)
                            }
                            rows={5}
                            placeholder="Tulis hasil verifikasi atau alasan perubahan status di sini..."
                        />
                        {errors.notes_admin && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.notes_admin}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
