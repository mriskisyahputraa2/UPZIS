import { InputRupiah } from '@/components/InputRupiah';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SettingsForm } from '@/types/settings';
import InputError from '@/components/input-error';

/**
 * @interface FinancialSettingsCardProps
 * @description Properti untuk komponen FinancialSettingsCard.
 * @property {Partial<SettingsForm>} data - Objek data dari hook useForm Inertia.
 * @property {Function} setData - Fungsi untuk mengubah data form.
 * @property {object} errors - Objek error validasi dari Inertia.
 */
interface FinancialSettingsCardProps {
    data: Partial<SettingsForm>;
    setData: (field: keyof SettingsForm, value: any) => void;
    errors: any;
}

/**
 * @name FinancialSettingsCard
 * @description Komponen kartu untuk form pengaturan finansial (harga emas, alokasi dana).
 * @param {FinancialSettingsCardProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const FinancialSettingsCard = ({
    data,
    setData,
    errors,
}: FinancialSettingsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pengaturan Finansial</CardTitle>
                <CardDescription>
                    Konfigurasi ini memengaruhi perhitungan nisab dan alokasi
                    dana.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="harga_emas_per_gram">
                        Harga Emas per Gram (Rp)
                    </Label>
                    <InputRupiah
                        id="harga_emas"
                        value={data.harga_emas_per_gram}
                        onValueChange={(value) =>
                            setData('harga_emas_per_gram', value)
                        }
                    />
                    <InputError message={errors.harga_emas_per_gram} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="alokasi_fakir_miskin_persen">
                        Alokasi Dana Fakir Miskin (%)
                    </Label>
                    <Input
                        id="alokasi_fakir_miskin_persen"
                        type="number"
                        value={data.alokasi_fakir_miskin_persen}
                        onChange={(e) =>
                            setData(
                                'alokasi_fakir_miskin_persen',
                                e.target.value,
                            )
                        }
                        min="0"
                        max="100"
                    />
                    <InputError message={errors.alokasi_fakir_miskin_persen} />
                </div>
            </CardContent>
        </Card>
    );
};

export default FinancialSettingsCard;
