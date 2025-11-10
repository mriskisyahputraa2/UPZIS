import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/publicLayout';
import { useZakatCalculator } from '@/hooks/useZakatCalculator';
import { Head } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { Toaster } from 'sonner';
import { formatCurrency } from './kalkulator-helpers';
import CalculatorHeader from './partials/CalculatorHeader';
import CalculationResult from './partials/CalculationResult';
import CalculatorPlaceholder from './partials/CalculatorPlaceholder';
import FaqSection from './partials/FaqSection';
import ZakatForm from './partials/ZakatForm';

/**
 * Halaman Kalkulator Zakat.
 *
 * Halaman ini memungkinkan pengguna untuk menghitung kewajiban zakat mereka
 * berdasarkan jenis zakat (profesi atau maal) dan input keuangan lainnya.
 * Logika utama dikelola oleh custom hook `useZakatCalculator`.
 *
 * @param {{ jenisZakat: Array<object>, hargaEmas: number }} props - Props dari server.
 */
export default function Kalkulator({ jenisZakat, hargaEmas }) {
    const {
        activeZakatId,
        handleTypeChange,
        inputs,
        handleInputChange,
        activeZakatDetails,
        isProfesi,
        isLoading,
        result,
        bayarZakatUrl,
    } = useZakatCalculator(jenisZakat);

    return (
        <PublicLayout>
            <Head title="Kalkulator Zakat" />
            <Toaster richColors position="top-center" />

            <CalculatorHeader />

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
                            <ZakatForm
                                jenisZakat={jenisZakat}
                                activeZakatId={activeZakatId}
                                handleTypeChange={handleTypeChange}
                                inputs={inputs}
                                handleInputChange={handleInputChange}
                                isProfesi={isProfesi}
                                activeZakatDetails={activeZakatDetails}
                            />

                            <div className="min-h-[200px]">
                                {result && !isLoading ? (
                                    <CalculationResult
                                        result={result}
                                        bayarZakatUrl={bayarZakatUrl}
                                    />
                                ) : (
                                    <CalculatorPlaceholder
                                        isLoading={isLoading}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <FaqSection />
        </PublicLayout>
    );
}