import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import React from 'react';

/**
 * Komponen input kustom untuk mata uang.
 */
const CurrencyInput = ({ value, onChange, id, placeholder = '0' }) => (
    <div className="relative">
        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
            Rp
        </span>
        <Input
            id={id}
            type="text"
            value={value ? new Intl.NumberFormat('id-ID').format(value) : ''}
            onChange={onChange}
            className="h-12 pr-4 pl-10 text-lg"
            placeholder={placeholder}
        />
    </div>
);

/**
 * @typedef {object} ZakatFormProps
 * @property {Array<object>} jenisZakat - Daftar jenis zakat.
 * @property {string} activeZakatId - ID jenis zakat yang aktif.
 * @property {(id: string) => void} handleTypeChange - Handler saat jenis zakat berubah.
 * @property {object} inputs - Nilai input form.
 * @property {(e: React.ChangeEvent<HTMLInputElement>, field: string) => void} handleInputChange - Handler saat nilai input berubah.
 * @property {boolean} isProfesi - Apakah jenis zakat yang dipilih adalah zakat profesi.
 * @property {object | undefined} activeZakatDetails - Detail dari jenis zakat yang aktif.
 */

/**
 * Komponen formulir untuk menginput data perhitungan zakat.
 * Tidak mengandung Card wrapper, hanya elemen-elemen form.
 *
 * @param {ZakatFormProps} props
 * @returns {JSX.Element}
 */
const ZakatForm = ({
    jenisZakat,
    activeZakatId,
    handleTypeChange,
    inputs,
    handleInputChange,
    isProfesi,
    activeZakatDetails,
}) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="font-semibold">Pilih Jenis Zakat</Label>
                <Select value={activeZakatId} onValueChange={handleTypeChange}>
                    <SelectTrigger className="h-14 text-base">
                        <SelectValue placeholder="Pilih jenis zakat..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {jenisZakat.map((jenis) => (
                                <SelectItem
                                    key={jenis.id}
                                    value={jenis.id.toString()}
                                    className="text-base"
                                >
                                    {jenis.name}
                                </SelectItem>
                            ))}
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
                        <CurrencyInput
                            id="pendapatan_pokok"
                            value={inputs.pendapatanPokok}
                            onChange={(e) =>
                                handleInputChange(e, 'pendapatanPokok')
                            }
                        />
                    </div>

                    {isProfesi && (
                        <>
                            <div className="space-y-2">
                                <Label
                                    className="font-bold"
                                    htmlFor="pendapatan_lain"
                                >
                                    Pendapatan Lain (Bonus, THR, dll)
                                </Label>
                                <CurrencyInput
                                    id="pendapatan_lain"
                                    value={inputs.pendapatanLain}
                                    onChange={(e) =>
                                        handleInputChange(e, 'pendapatanLain')
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    className="font-bold"
                                    htmlFor="hutang_cicilan"
                                >
                                    Hutang/Cicilan Pokok (per bulan)
                                </Label>
                                <CurrencyInput
                                    id="hutang_cicilan"
                                    value={inputs.hutangCicilan}
                                    onChange={(e) =>
                                        handleInputChange(e, 'hutangCicilan')
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ZakatForm;