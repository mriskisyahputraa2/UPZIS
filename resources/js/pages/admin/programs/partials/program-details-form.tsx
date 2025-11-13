import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ProgramForm } from '@/types/program';
import InputError from '@/components/input-error';

/**
 * @interface ProgramDetailsFormProps
 * @description Properti untuk komponen ProgramDetailsForm.
 * @property {ProgramForm} data - Objek data dari hook useForm Inertia.
 * @property {Function} setData - Fungsi untuk mengubah data form.
 * @property {object} errors - Objek error validasi dari Inertia.
 */
interface ProgramDetailsFormProps {
    data: Partial<ProgramForm>;
    setData: (field: keyof ProgramForm, value: any) => void;
    errors: any;
}

/**
 * @name ProgramDetailsForm
 * @description Komponen form untuk mengisi detail dasar dari sebuah program.
 * @param {ProgramDetailsFormProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const ProgramDetailsForm = ({
    data,
    setData,
    errors,
}: ProgramDetailsFormProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detail Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Program *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={5}
                    />
                    <InputError message={errors.description} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="program_date">
                            Tanggal Pelaksanaan *
                        </Label>
                        <Input
                            id="program_date"
                            type="date"
                            value={data.program_date}
                            onChange={(e) =>
                                setData('program_date', e.target.value)
                            }
                        />
                        <InputError message={errors.program_date} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status Publikasi *</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">
                                    Draft (Disembunyikan)
                                </SelectItem>
                                <SelectItem value="Published">
                                    Published (Tampilkan)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgramDetailsForm;
