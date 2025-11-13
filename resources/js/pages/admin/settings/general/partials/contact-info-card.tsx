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
 * @interface ContactInfoCardProps
 * @description Properti untuk komponen ContactInfoCard.
 * @property {Partial<SettingsForm>} data - Objek data dari hook useForm Inertia.
 * @property {Function} setData - Fungsi untuk mengubah data form.
 * @property {object} errors - Objek error validasi dari Inertia.
 */
interface ContactInfoCardProps {
    data: Partial<SettingsForm>;
    setData: (field: keyof SettingsForm, value: any) => void;
    errors: any;
}

/**
 * @name ContactInfoCard
 * @description Komponen kartu untuk form informasi kontak publik.
 * @param {ContactInfoCardProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
const ContactInfoCard = ({ data, setData, errors }: ContactInfoCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Kontak Publik</CardTitle>
                <CardDescription>
                    Informasi ini akan ditampilkan di halaman depan dan footer
                    website.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="contact_address">Alamat</Label>
                    <Input
                        id="contact_address"
                        type="text"
                        value={data.contact_address}
                        onChange={(e) =>
                            setData('contact_address', e.target.value)
                        }
                    />
                    <InputError message={errors.contact_address} />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contact_phone">Nomor Telepon</Label>
                        <Input
                            id="contact_phone"
                            type="text"
                            value={data.contact_phone}
                            onChange={(e) =>
                                setData('contact_phone', e.target.value)
                            }
                        />
                        <InputError message={errors.contact_phone} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact_email">Alamat Email</Label>
                        <Input
                            id="contact_email"
                            type="email"
                            value={data.contact_email}
                            onChange={(e) =>
                                setData('contact_email', e.target.value)
                            }
                        />
                        <InputError message={errors.contact_email} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ContactInfoCard;
