import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AvailablePenyaluran, Periode, ProgramForm } from '@/types/program';
import { useMemo, useState } from 'react';

// Helper Functions
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

/**
 * @interface PenyaluranLinkerProps
 * @description Properti untuk komponen PenyaluranLinker.
 * @property {AvailablePenyaluran[]} availablePenyalurans - Daftar penyaluran yang bisa dihubungkan.
 * @property {Periode[]} periodes - Daftar periode untuk filter.
 * @property {number[]} linkedIds - ID penyaluran yang sudah terhubung.
 * @property {Function} setData - Fungsi `setData` dari `useForm`.
 */
interface PenyaluranLinkerProps {
    availablePenyalurans: AvailablePenyaluran[];
    periodes: Periode[];
    linkedIds: number[];
    setData: (field: keyof ProgramForm, value: any) => void;
}

/**
 * @name PenyaluranLinker
 * @description Komponen untuk menghubungkan data penyaluran ke sebuah program.
 * @param {PenyaluranLinkerProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const PenyaluranLinker = ({
    availablePenyalurans,
    periodes,
    linkedIds,
    setData,
}: PenyaluranLinkerProps) => {
    const [filterPeriode, setFilterPeriode] = useState('all');

    const filteredPenyalurans = useMemo(() => {
        if (filterPeriode === 'all') {
            return availablePenyalurans;
        }
        return availablePenyalurans.filter(
            (p) => p.permohonan.periode_id == Number(filterPeriode),
        );
    }, [filterPeriode, availablePenyalurans]);

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredPenyalurans.map((p) => p.id);
        const currentIds = new Set(linkedIds);
        filteredIds.forEach((id) => currentIds.add(id));
        setData('penyaluran_ids', Array.from(currentIds));
    };

    const handleDeselectAllFiltered = () => {
        const filteredIds = new Set(filteredPenyalurans.map((p) => p.id));
        setData(
            'penyaluran_ids',
            linkedIds.filter((id) => !filteredIds.has(id)),
        );
    };

    const handlePenyaluranCheck = (penyaluranId: number) => {
        if (linkedIds.includes(penyaluranId)) {
            setData(
                'penyaluran_ids',
                linkedIds.filter((id) => id !== penyaluranId),
            );
        } else {
            setData('penyaluran_ids', [...linkedIds, penyaluranId]);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hubungkan Data Penyaluran</CardTitle>
                <CardDescription>
                    Pilih penyaluran yang termasuk dalam program ini. Total dana
                    akan dihitung otomatis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-col gap-4 rounded-lg border bg-muted/50 p-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                        <Label>Filter berdasarkan Periode</Label>
                        <Select
                            value={filterPeriode}
                            onValueChange={setFilterPeriode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih periode..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tampilkan Semua Periode
                                </SelectItem>
                                {periodes.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-shrink-0 items-end gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleSelectAllFiltered}
                        >
                            Pilih Semua
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-200"
                            onClick={handleDeselectAllFiltered}
                        >
                            Batal Pilih
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-72 rounded-md border">
                    <div className="p-4">
                        {filteredPenyalurans.length > 0 ? (
                            filteredPenyalurans.map((penyaluran) => (
                                <div
                                    key={penyaluran.id}
                                    className="flex items-start space-x-3 py-3"
                                >
                                    <Checkbox
                                        id={`penyaluran-${penyaluran.id}`}
                                        checked={linkedIds.includes(
                                            penyaluran.id,
                                        )}
                                        onCheckedChange={() =>
                                            handlePenyaluranCheck(penyaluran.id)
                                        }
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor={`penyaluran-${penyaluran.id}`}
                                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {formatCurrency(penyaluran.amount)}{' '}
                                            kepada{' '}
                                            {
                                                penyaluran.permohonan.mustahik
                                                    .name
                                            }
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(
                                                penyaluran.distribution_date,
                                            )}{' '}
                                            -{' '}
                                            <span className="capitalize">
                                                {penyaluran.kategori_alokasi.replace(
                                                    /_/g,
                                                    ' ',
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="py-10 text-center text-sm text-muted-foreground">
                                Tidak ada data penyaluran yang cocok dengan
                                filter.
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default PenyaluranLinker;
