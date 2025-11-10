import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import React from 'react';
import { formatCurrency } from '../kalkulator-helpers';

/**
 * @typedef {import('../hooks/useZakatCalculator').ZakatResult} ZakatResult
 */

/**
 * @typedef {object} CalculationResultProps
 * @property {ZakatResult} result - Objek hasil perhitungan zakat.
 * @property {string} bayarZakatUrl - URL untuk tombol pembayaran zakat.
 */

/**
 * Komponen untuk menampilkan hasil perhitungan zakat.
 * Menampilkan rincian pendapatan, nisab, status kewajiban zakat,
 * dan nominal zakat yang harus dibayar.
 *
 * @param {CalculationResultProps} props
 * @returns {JSX.Element}
 */
const CalculationResult = ({ result, bayarZakatUrl }) => {
    return (
        <div className="space-y-6 duration-500 animate-in fade-in">
            <Separator />
            <h3 className="text-center text-lg font-bold">Hasil Perhitungan</h3>

            <div className="space-y-2 rounded-lg border bg-muted/30 p-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Pendapatan Bersih
                    </span>
                    <span className="font-semibold">
                        {formatCurrency(result.pendapatan_bersih)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Ambang Batas (Nisab)
                    </span>
                    <span className="font-semibold">
                        {formatCurrency(result.nisab)}
                    </span>
                </div>
            </div>

            <div
                className={`rounded-lg border p-6 text-center ${
                    result.wajib_zakat
                        ? 'border-green-200 bg-green-50'
                        : 'border-yellow-200 bg-yellow-50'
                }`}
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
                            Jumlah Zakat yang Harus Dikeluarkan:
                        </p>
                        <p className="text-4xl font-extrabold text-primary">
                            {formatCurrency(result.nominal_zakat)}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center pt-4">
                <Link href={bayarZakatUrl}>
                    <Button size="lg" className="text-base font-bold">
                        Tunaikan Zakat Sekarang{' '}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default CalculationResult;
