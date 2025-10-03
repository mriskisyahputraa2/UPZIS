import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Calculator, Loader } from 'lucide-react';
import { useState } from 'react';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function Index({ jenisZakat, hargaEmas }) {
    const [activeTab, setActiveTab] = useState(
        jenisZakat[0]?.id.toString() || '',
    );
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        // Siapkan data untuk dikirim ke backend
        const selectedZakat = jenisZakat.find(
            (z) => z.id.toString() === activeTab,
        );
        let payload = { jenis_zakat_id: activeTab };
        if (selectedZakat.name === 'Zakat Profesi') {
            payload.pendapatan = inputValue;
        } else if (selectedZakat.name === 'Zakat Simpanan') {
            payload.simpanan = inputValue;
        }

        try {
            const response = await axios.post(
                route('kalkulator.hitung'),
                payload,
            );
            setResult(response.data);
        } catch (error) {
            console.error('Calculation error:', error);
            // Anda bisa menambahkan notifikasi toast error di sini
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = (zakat) => {
        let label = 'Jumlah Harta';
        let placeholder = 'Masukkan jumlah harta...';

        if (zakat.name === 'Zakat Profesi') {
            label = 'Pendapatan per Bulan (setelah dipotong kebutuhan pokok)';
            placeholder = 'Contoh: 10000000';
        } else if (zakat.name === 'Zakat Simpanan') {
            label = 'Total Saldo Simpanan (Emas, Perak, Uang Tunai, Investasi)';
            placeholder = 'Contoh: 150000000';
        }

        return (
            <form onSubmit={handleCalculate} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="harta" className="text-base">
                        {label}
                    </Label>
                    <Input
                        id="harta"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="h-12 text-lg"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="h-12 w-full text-base font-bold"
                >
                    {isLoading ? (
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Calculator className="mr-2 h-5 w-5" />
                    )}
                    Hitung Zakat
                </Button>
            </form>
        );
    };

    return (
        <PublicLayout>
            <Head title="Kalkulator Zakat" />

            <section className="bg-green-700 pt-32 pb-16 text-white">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Kalkulator Zakat
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Hitung kewajiban zakat Anda dengan mudah dan akurat
                        sesuai syariat.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-24">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">
                                Pilih Jenis Zakat
                            </CardTitle>
                            <p className="pt-1 text-sm text-muted-foreground">
                                Nisab didasarkan pada harga emas saat ini:{' '}
                                {formatCurrency(hargaEmas)} / gram
                            </p>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={activeTab}
                                onValueChange={(val) => {
                                    setActiveTab(val);
                                    setInputValue('');
                                    setResult(null);
                                }}
                                className="w-full"
                            >
                                <TabsList className="grid h-12 w-full grid-cols-2">
                                    {jenisZakat.map((zakat) => (
                                        <TabsTrigger
                                            key={zakat.id}
                                            value={zakat.id.toString()}
                                            className="text-base"
                                        >
                                            {zakat.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {jenisZakat.map((zakat) => (
                                    <TabsContent
                                        key={zakat.id}
                                        value={zakat.id.toString()}
                                        className="mt-6"
                                    >
                                        {renderForm(zakat)}
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>

                    {result && (
                        <Card className="mt-8 shadow-lg duration-500 animate-in fade-in">
                            <CardHeader>
                                <CardTitle>Hasil Perhitungan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-base">
                                    <span>Batas Nisab (85gr Emas)</span>{' '}
                                    <span className="font-bold">
                                        {formatCurrency(result.nisab)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span>Harta yang Dihitung</span>{' '}
                                    <span className="font-bold">
                                        {formatCurrency(result.harta_dihitung)}
                                    </span>
                                </div>
                                <hr />
                                {result.wajib_zakat ? (
                                    <div className="space-y-4 pt-4 text-center">
                                        <p className="text-lg font-bold text-green-600">
                                            Anda Wajib Membayar Zakat
                                        </p>
                                        <p className="text-4xl font-extrabold">
                                            {formatCurrency(
                                                result.nominal_zakat,
                                            )}
                                        </p>
                                        <Link
                                            href="/login"
                                            data={{
                                                amount: result.nominal_zakat,
                                                zakat_type: 'Zakat Profesi',
                                            }}
                                        >
                                            <Button
                                                size="lg"
                                                className="mt-4 h-12 w-full text-base font-bold"
                                            >
                                                Bayar Zakat Sekarang{' '}
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-4 text-center">
                                        <p className="text-lg text-muted-foreground">
                                            Alhamdulillah, harta Anda belum
                                            mencapai batas nisab.
                                        </p>
                                        <p className="text-2xl font-bold">
                                            Anda Belum Wajib Membayar Zakat
                                        </p>
                                        <Link href="#">
                                            {' '}
                                            {/* Arahkan ke halaman infaq/sedekah */}
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="mt-4 h-12 w-full text-base font-bold"
                                            >
                                                Tunaikan Infaq & Sedekah
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
