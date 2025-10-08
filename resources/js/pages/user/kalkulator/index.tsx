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
    const [pendapatanPokok, setPendapatanPokok] = useState('');
    const [pendapatanLain, setPendapatanLain] = useState('');
    const [hutangCicilan, setHutangCicilan] = useState('');

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const activeZakatDetails = useMemo(() => {
        return jenisZakat.find(
            (zakat) => zakat.id.toString() === activeZakatId,
        );
    }, [activeZakatId, jenisZakat]);

    useEffect(() => {
        if (!activeZakatId) return;
        if (
            pendapatanPokok === '' &&
            pendapatanLain === '' &&
            hutangCicilan === ''
        ) {
            setResult(null);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setIsLoading(true);
            axios
                .post('/kalkulator-zakat/hitung', {
                    jenis_zakat_id: activeZakatId,
                    pendapatan_pokok: pendapatanPokok || 0,
                    pendapatan_lain: pendapatanLain || 0,
                    hutang_cicilan: hutangCicilan || 0,
                })
                .then((response) => setResult(response.data))
                .catch((error) => toast.error('Gagal menghitung. Coba lagi.'))
                .finally(() => setIsLoading(false));
        }, 700);

        return () => clearTimeout(delayDebounceFn);
    }, [pendapatanPokok, pendapatanLain, hutangCicilan, activeZakatId]);

    const handleInputChange = (e, setter) => {
        const value = e.target.value.replace(/\D/g, '');
        setter(value);
    };

    const handleTypeChange = (id) => {
        if (!id) return;
        setActiveZakatId(id);
        setPendapatanPokok('');
        setPendapatanLain('');
        setHutangCicilan('');
        setResult(null);
    };

    const ActiveIcon = activeZakatDetails
        ? zakatIcons[activeZakatDetails.name] || Wallet
        : Wallet;

    // Cek apakah jenis zakat profesi
    const isProfesi = activeZakatDetails?.name
        .toLowerCase()
        .includes('profesi');

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
                                                <ActiveIcon className="h-5 w-5 text-muted-foreground" />
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
                                    <div className="space-y-6 pt-4 text-left duration-300 animate-in fade-in">
                                        <p className="text-center text-sm text-muted-foreground">
                                            {activeZakatDetails.description}
                                        </p>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="pendapatan_pokok"
                                                className="font-bold"
                                            >
                                                {isProfesi
                                                    ? 'Pendapatan Pokok (per bulan)'
                                                    : 'Total Harta Tersimpan (Per Tahun)'}
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                                                    Rp
                                                </span>
                                                <Input
                                                    id="pendapatan_pokok"
                                                    type="text"
                                                    value={
                                                        pendapatanPokok
                                                            ? new Intl.NumberFormat(
                                                                  'id-ID',
                                                              ).format(
                                                                  pendapatanPokok,
                                                              )
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            setPendapatanPokok,
                                                        )
                                                    }
                                                    className="h-12 pr-4 pl-10 text-lg"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        {isProfesi && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label
                                                        className="font-bold"
                                                        htmlFor="pendapatan_lain"
                                                    >
                                                        Pendapatan Lain (Bonus,
                                                        THR, dll)
                                                    </Label>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                                                            Rp
                                                        </span>
                                                        <Input
                                                            id="pendapatan_lain"
                                                            type="text"
                                                            value={
                                                                pendapatanLain
                                                                    ? new Intl.NumberFormat(
                                                                          'id-ID',
                                                                      ).format(
                                                                          pendapatanLain,
                                                                      )
                                                                    : ''
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    setPendapatanLain,
                                                                )
                                                            }
                                                            className="h-12 pr-4 pl-10 text-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label
                                                        className="font-bold"
                                                        htmlFor="hutang_cicilan"
                                                    >
                                                        Hutang/Cicilan Pokok
                                                        (per bulan)
                                                    </Label>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                                                            Rp
                                                        </span>
                                                        <Input
                                                            id="hutang_cicilan"
                                                            type="text"
                                                            value={
                                                                hutangCicilan
                                                                    ? new Intl.NumberFormat(
                                                                          'id-ID',
                                                                      ).format(
                                                                          hutangCicilan,
                                                                      )
                                                                    : ''
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    setHutangCicilan,
                                                                )
                                                            }
                                                            className="h-12 pr-4 pl-10 text-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
                                                        Ambang batas (nisab){' '}
                                                        {isProfesi
                                                            ? 'bulanan'
                                                            : 'tahunan'}{' '}
                                                        adalah{' '}
                                                        <strong>
                                                            {formatCurrency(
                                                                result.nisab,
                                                            )}
                                                        </strong>
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
