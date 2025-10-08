import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowRight,
    Calculator,
    CheckCircle,
    HelpCircle,
    Info,
    Landmark,
    Loader,
    Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';

const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const zakatIcons = {
    'Zakat Profesi / Penghasilan': Wallet,
    'Zakat Maal (Simpanan & Emas)': Landmark,
    'Zakat Perdagangan': Landmark,
};

// Data untuk FAQ
const faqs = [
    {
        q: 'Mengapa nisab zakat diukur dengan emas?',
        a: 'Nisab zakat maal dianalogikan (qiyas) dengan 85 gram emas murni karena emas memiliki nilai yang stabil dan diterima secara universal sebagai standar kekayaan dari zaman Rasulullah SAW hingga sekarang.',
    },
    {
        q: 'Apakah hutang cicilan bisa menjadi pengurang zakat profesi?',
        a: 'Ulama kontemporer umumnya berpendapat bahwa hutang yang dapat menjadi pengurang adalah hutang jatuh tempo yang harus dibayarkan saat itu juga dan mengurangi kebutuhan pokok. Cicilan rutin (KPR, kendaraan) umumnya tidak termasuk pengurang.',
    },
    {
        q: 'Bagaimana jika penghasilan saya tidak menentu setiap bulan?',
        a: 'Jika penghasilan tidak menentu, Anda bisa mengakumulasikannya selama satu tahun. Jika total pendapatan bersih selama satu tahun melebihi nisab tahunan (85 gram emas), maka Anda wajib mengeluarkan zakat sebesar 2.5% dari total pendapatan tersebut.',
    },
];

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
    const isProfesi = activeZakatDetails?.name
        .toLowerCase()
        .includes('profesi');

    const bayarZakatUrl =
        result && result.wajib_zakat && result.nominal_zakat > 0
            ? `/bayar-zakat?amount=${result.nominal_zakat}`
            : '/bayar-zakat';

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
                        Hitung kewajiban zakat maal Anda dengan mudah, akurat,
                        dan transparan.
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-16">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">
                                Hitung Zakat Anda
                            </CardTitle>
                            <CardDescription className="flex items-center justify-center gap-2 pt-2">
                                <Info className="h-4 w-4" />
                                <span>
                                    Nisab berdasarkan harga emas:{' '}
                                    <strong>
                                        {formatCurrency(hargaEmas)} / gram
                                    </strong>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 px-4 sm:px-6">
                            <div className="space-y-6">
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

                            <Separator />

                            <div className="min-h-[200px]">
                                {isLoading && (
                                    <div className="flex h-full items-center justify-center pt-10">
                                        <Loader className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                )}

                                {result && !isLoading && (
                                    <div className="space-y-6 duration-500 animate-in fade-in">
                                        <h3 className="text-center text-lg font-bold">
                                            Hasil Perhitungan
                                        </h3>

                                        <div className="space-y-2 rounded-lg border bg-muted/30 p-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Pendapatan Bersih
                                                </span>
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        result.pendapatan_bersih,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Ambang Batas (Nisab)
                                                </span>
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        result.nisab,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={`rounded-lg border p-6 text-center ${result.wajib_zakat ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}
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
                                                        {result.wajib_zakat
                                                            ? 'Penghasilan Anda telah melebihi ambang batas (nisab).'
                                                            : 'Penghasilan Anda belum mencapai ambang batas (nisab).'}
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

                                        <div className="flex justify-center pt-4">
                                            <Link href={bayarZakatUrl}>
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
                                )}

                                {!isLoading && !result && (
                                    <div className="flex h-full flex-col items-center justify-center pt-10 text-center text-muted-foreground duration-500 animate-in fade-in">
                                        <Calculator className="mb-4 h-12 w-12" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            Hasil Perhitungan Akan Tampil di
                                            Sini
                                        </h3>
                                        <p className="mt-1 text-sm">
                                            Silakan isi form di atas untuk
                                            melihat hasil perhitungan zakat Anda
                                            secara otomatis.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="pb-24">
                <div className="container mx-auto max-w-4xl px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Pertanyaan Umum
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                            Jawaban cepat untuk pertanyaan paling umum seputar
                            perhitungan zakat.
                        </p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index + 1}`}
                            >
                                <AccordionTrigger className="text-left text-lg font-semibold text-green-800 hover:no-underline">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-slate-600">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </PublicLayout>
    );
}
