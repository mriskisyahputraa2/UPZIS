// PenyaluranForm.tsx (Sudah diperbaiki)

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

// Helper format mata uang
const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function PenyaluranForm({
    permohonan,
    penyaluran = null,
    availableFunds,
    onOpenChange,
    onSuccess,
}) {
    const isEditMode = !!penyaluran;
    const defaultKategori =
        permohonan.kategori_pemohon === 'mahasiswa' ? 'kampus' : 'fakir_miskin';

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        amount: penyaluran?.amount || '',
        distribution_date:
            penyaluran?.distribution_date ||
            new Date().toISOString().slice(0, 10),
        notes: penyaluran?.notes || '',
        kategori_alokasi: penyaluran?.kategori_alokasi || defaultKategori,
    });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('amount', value);
    };

    const handleSubmit = (e: React.FormEvent) => {
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
        <DialogContent className="sm:max-w-lg md:max-w-xl">
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

                <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4">
                    <h4 className="text-sm font-semibold">
                        Dana Tersedia (Real-time)
                    </h4>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Mahasiswa:
                            </span>
                            <span
                                className={`font-medium ${availableFunds.sisaDanaKampus < 0 ? 'text-red-600' : 'text-primary'}`}
                            >
                                {formatCurrency(availableFunds.sisaDanaKampus)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Fakir Miskin:
                            </span>
                            <span
                                className={`font-medium ${availableFunds.sisaDanaFakirMiskin < 0 ? 'text-red-600' : 'text-primary'}`}
                            >
                                {formatCurrency(
                                    availableFunds.sisaDanaFakirMiskin,
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Infaq:
                            </span>
                            <span
                                className={`font-medium ${availableFunds.sisaDanaInfaq < 0 ? 'text-red-600' : 'text-primary'}`}
                            >
                                {formatCurrency(availableFunds.sisaDanaInfaq)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Sedekah:
                            </span>
                            <span
                                className={`font-medium ${availableFunds.sisaDanaSedekah < 0 ? 'text-red-600' : 'text-primary'}`}
                            >
                                {formatCurrency(availableFunds.sisaDanaSedekah)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ## PERUBAHAN UTAMA DI SINI: Menggunakan satu grid ## */}
                <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Jumlah (Rp) *</Label>
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
                            Tanggal Penyaluran *
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

                    {/* Tambahkan sm:col-span-2 agar elemen ini mengambil lebar penuh */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="kategori_alokasi">
                            Sumber Alokasi Dana *
                        </Label>
                        <Select
                            value={data.kategori_alokasi}
                            onValueChange={(value) =>
                                setData('kategori_alokasi', value)
                            }
                        >
                            <SelectTrigger id="kategori_alokasi">
                                <SelectValue placeholder="Pilih sumber dana..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Sumber Dana Zakat</SelectLabel>
                                    <SelectItem value="kampus">
                                        Mahasiswa (Sisa:{' '}
                                        {formatCurrency(
                                            availableFunds.sisaDanaKampus,
                                        )}
                                        )
                                    </SelectItem>
                                    <SelectItem value="fakir_miskin">
                                        Fakir Miskin (Sisa:{' '}
                                        {formatCurrency(
                                            availableFunds.sisaDanaFakirMiskin,
                                        )}
                                        )
                                    </SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Sumber Dana Umum</SelectLabel>
                                    <SelectItem value="infaq">
                                        Gunakan Dana Infaq (Sisa:{' '}
                                        {formatCurrency(
                                            availableFunds.sisaDanaInfaq,
                                        )}
                                        )
                                    </SelectItem>
                                    <SelectItem value="sedekah">
                                        Gunakan Dana Sedekah (Sisa:{' '}
                                        {formatCurrency(
                                            availableFunds.sisaDanaSedekah,
                                        )}
                                        )
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.kategori_alokasi && (
                            <p className="text-sm text-red-500">
                                {errors.kategori_alokasi}
                            </p>
                        )}
                    </div>

                    {/* Tambahkan sm:col-span-2 agar elemen ini mengambil lebar penuh */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            maxLength={255}
                            rows={3}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-500">
                                {errors.notes}
                            </p>
                        )}
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
