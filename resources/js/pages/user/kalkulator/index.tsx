// resources/js/Pages/Public/Kalkulator/Index.jsx (Dropdown + Logika Benar)

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowRight,
    CheckCircle,
    HelpCircle,
    Info,
    Landmark,
    Loader,
    Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// Data ikon untuk setiap jenis zakat
const zakatIcons = {
    'Zakat Profesi': Wallet,
    'Zakat Emas & Simpanan': Landmark,
};

export default function Kalkulator({ jenisZakat, hargaEmas }) {
    const defaultZakatId =
        jenisZakat.length > 0 ? jenisZakat[0].id.toString() : '';

    const [activeZakatId, setActiveZakatId] = useState(defaultZakatId);
    const [nilaiHarta, setNilaiHarta] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const activeZakatDetails = useMemo(() => {
        return jenisZakat.find(
            (zakat) => zakat.id.toString() === activeZakatId,
        );
    }, [activeZakatId, jenisZakat]);

    useEffect(() => {
        if (nilaiHarta === '' || !activeZakatId) {
            setResult(null);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            let hartaUntukDihitung = parseFloat(nilaiHarta);

            // Jika Zakat Profesi, kalikan pendapatan bulanan dengan 12
            if (activeZakatDetails?.name.toLowerCase().includes('profesi')) {
                hartaUntukDihitung = parseFloat(nilaiHarta) * 12;
            }

            setIsLoading(true);
            axios
                .post('/kalkulator-zakat/hitung', {
                    jenis_zakat_id: activeZakatId,
                    nilai_harta: hartaUntukDihitung,
                })
                .then((response) => setResult(response.data))
                .catch((error) => toast.error('Gagal menghitung. Coba lagi.'))
                .finally(() => setIsLoading(false));
        }, 700);

        return () => clearTimeout(delayDebounceFn);
    }, [nilaiHarta, activeZakatId]);

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setNilaiHarta(value);
    };

    const handleTypeChange = (id) => {
        if (!id) return;
        setActiveZakatId(id);
        setNilaiHarta('');
        setResult(null);
    };

    const ActiveIcon = activeZakatDetails
        ? zakatIcons[activeZakatDetails.name] || Wallet
        : Wallet;

    return (
        <PublicLayout>
            <Head title="Kalkulator Zakat" />
            <Toaster richColors position="top-center" />

            <section className="bg-green-700 pt-32 pb-24 text-white">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Kalkulator Zakat
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Hitung kewajiban zakat maal Anda dengan mudah dan
                        akurat.
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-24">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">
                                Hitung Zakat Anda
                            </CardTitle>
                            <CardDescription className="flex items-center justify-center gap-2 pt-2">
                                <Info className="h-4 w-4" />
                                <span>
                                    Perhitungan nisab berdasarkan harga emas:{' '}
                                    <strong>
                                        {formatCurrency(hargaEmas)} / gram
                                    </strong>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <div className="mx-auto max-w-md space-y-8">
                                <div className="space-y-2">
                                    <Label className="font-semibold">
                                        Pilih Jenis Zakat
                                    </Label>
                                    <Select
                                        value={activeZakatId}
                                        onValueChange={handleTypeChange}
                                    >
                                        <SelectTrigger className="h-14 text-base">
                                            <div className="flex items-center gap-3">
                                                {/* <ActiveIcon className="h-5 w-5 text-muted-foreground" /> */}
                                                <SelectValue placeholder="Pilih jenis zakat..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Zakat Maal
                                                </SelectLabel>
                                                {jenisZakat.map((jenis) => {
                                                    const Icon =
                                                        zakatIcons[
                                                            jenis.name
                                                        ] || Wallet;
                                                    return (
                                                        <SelectItem
                                                            key={jenis.id}
                                                            value={jenis.id.toString()}
                                                            className="text-base"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Icon className="h-5 w-5 text-muted-foreground" />
                                                                <span>
                                                                    {jenis.name}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {activeZakatDetails && (
                                    <div className="space-y-2 pt-4 text-center duration-300 animate-in fade-in">
                                        <p className="text-sm text-muted-foreground">
                                            {activeZakatDetails.description}
                                        </p>
                                        <Label
                                            htmlFor="nilai_harta"
                                            className="text-lg font-bold"
                                        >
                                            {activeZakatDetails.name
                                                .toLowerCase()
                                                .includes('profesi')
                                                ? 'Total Pendapatan per Bulan '
                                                : 'Total Nilai Harta Tersimpan (selama 1 tahun)'}
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg text-muted-foreground">
                                                Rp
                                            </span>
                                            <Input
                                                id="nilai_harta"
                                                type="text"
                                                value={
                                                    nilaiHarta
                                                        ? new Intl.NumberFormat(
                                                              'id-ID',
                                                          ).format(nilaiHarta)
                                                        : ''
                                                }
                                                onChange={handleInputChange}
                                                className="h-16 rounded-full pr-4 pl-10 text-center text-3xl font-bold"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                {isLoading && (
                                    <div className="flex justify-center pt-10">
                                        <Loader className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                )}

                                {result && !isLoading && (
                                    <div className="duration-500 animate-in fade-in">
                                        <div
                                            className={`rounded-lg border p-6 text-center ${result.wajib_zakat ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50' : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50'}`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                {result.wajib_zakat ? (
                                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                                ) : (
                                                    <HelpCircle className="h-10 w-10 text-yellow-600" />
                                                )}
                                                <div>
                                                    <h4 className="text-xl font-bold">
                                                        {result.wajib_zakat
                                                            ? 'Anda Wajib Membayar Zakat'
                                                            : 'Anda Belum Wajib Membayar Zakat'}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Ambang batas (nisab)
                                                        tahunan adalah{' '}
                                                        {formatCurrency(
                                                            result.nisab,
                                                        )}
                                                        .
                                                    </p>
                                                </div>
                                            </div>
                                            {result.wajib_zakat && (
                                                <div className="mt-6 border-t pt-6">
                                                    <p className="text-muted-foreground">
                                                        Jumlah Zakat yang Harus
                                                        Dikeluarkan:
                                                    </p>
                                                    <p className="text-4xl font-extrabold text-primary">
                                                        {formatCurrency(
                                                            result.nominal_zakat,
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-center">
                                    <Link href="/bayar-zakat">
                                        <Button
                                            size="lg"
                                            className="text-base font-bold"
                                        >
                                            Tunaikan Zakat Sekarang{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
