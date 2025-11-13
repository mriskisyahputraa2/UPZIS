import InputError from '@/components/input-error';
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ZakatTypeForm as ZakatTypeFormType } from '@/types/zakat-type';

/**
 * @interface ZakatTypeFormProps
 * @description Properti untuk komponen ZakatTypeForm.
 * @property {Partial<ZakatTypeFormType>} data - Objek data dari hook useForm Inertia.
 * @property {Function} setData - Fungsi untuk mengubah data form.
 * @property {object} errors - Objek error validasi dari Inertia.
 */
interface ZakatTypeFormProps {
    data: Partial<ZakatTypeFormType>;
    setData: (field: keyof ZakatTypeFormType, value: any) => void;
    errors: any;
}

/**
 * @name ZakatTypeForm
 * @description Komponen form untuk membuat atau mengedit data jenis zakat.
 * @param {ZakatTypeFormProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
export function ZakatTypeForm({ data, setData, errors }: ZakatTypeFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detail Jenis Zakat</CardTitle>
                <CardDescription>
                    Isi semua informasi yang diperlukan untuk jenis zakat ini.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Jenis Zakat *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Cth: Zakat Penghasilan"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi *</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Jelaskan secara singkat tentang jenis zakat ini"
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="rate_percent">Rate (%) *</Label>
                        <Input
                            id="rate_percent"
                            type="number"
                            step="0.1"
                            value={data.rate_percent}
                            onChange={(e) =>
                                setData('rate_percent', e.target.value)
                            }
                        />
                        <InputError message={errors.rate_percent} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Tidak Aktif">
                                    Tidak Aktif
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nisab_basis">Basis Nisab *</Label>
                        <Select
                            value={data.nisab_basis}
                            onValueChange={(value) =>
                                setData('nisab_basis', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih basis nisab" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="emas">
                                    Emas (gram)
                                </SelectItem>
                                <SelectItem value="perak">
                                    Perak (gram)
                                </SelectItem>
                                <SelectItem value="beras">
                                    Beras (kg)
                                </SelectItem>
                                <SelectItem value="uang">
                                    Uang (Rupiah)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.nisab_basis} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nisab_quantity">
                            Kuantitas Nisab *
                        </Label>
                        <Input
                            id="nisab_quantity"
                            type="number"
                            value={data.nisab_quantity}
                            onChange={(e) =>
                                setData('nisab_quantity', e.target.value)
                            }
                            placeholder="Cth: 85 (untuk emas)"
                        />
                        <InputError message={errors.nisab_quantity} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}