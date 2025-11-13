import InputError from '@/components/input-error';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
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
import { PeriodeForm as PeriodeFormType } from '@/types/periode';
import { format } from 'date-fns';

/**
 * @interface PeriodeFormProps
 * @description Properti untuk komponen PeriodeForm.
 * @property {PeriodeFormType} data - Objek data dari hook useForm Inertia.
 * @property {(field: keyof PeriodeFormType, value: any) => void} setData - Fungsi untuk mengubah data form.
 * @property {object} errors - Objek error validasi dari Inertia.
 */
interface PeriodeFormProps {
    data: PeriodeFormType;
    setData: (field: keyof PeriodeFormType, value: any) => void;
    errors: any;
}

// Helper function untuk validasi dan parsing tanggal
const parseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString.replace(/-/g, '/'));
    if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return null;
    }
    return date;
};

/**
 * @name PeriodeForm
 * @description Komponen form utama untuk membuat atau mengedit data periode.
 * @param {PeriodeFormProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const PeriodeForm = ({ data, setData, errors }: PeriodeFormProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detail Periode</CardTitle>
                <CardDescription>
                    Isi semua informasi yang diperlukan untuk periode.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Periode *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Bantuan Pendidikan Semester Ganjil 2025"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Jelaskan singkat mengenai tujuan dan sasaran periode ini"
                    />
                    <InputError message={errors.description} />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="start_date">Tanggal Mulai *</Label>
                        <DatePicker
                            date={parseDate(data.start_date)}
                            setDate={(date) =>
                                setData(
                                    'start_date',
                                    date ? format(date, 'yyyy-MM-dd') : null,
                                )
                            }
                        />
                        <InputError message={errors.start_date} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end_date">Tanggal Selesai *</Label>
                        <DatePicker
                            date={parseDate(data.end_date)}
                            setDate={(date) =>
                                setData(
                                    'end_date',
                                    date ? format(date, 'yyyy-MM-dd') : null,
                                )
                            }
                        />
                        <InputError message={errors.end_date} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                        onValueChange={(value) => setData('status', value)}
                        value={data.status}
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
            </CardContent>
        </Card>
    );
};

export default PeriodeForm;
