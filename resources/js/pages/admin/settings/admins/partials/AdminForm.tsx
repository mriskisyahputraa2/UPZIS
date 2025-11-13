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
import { PasswordInput } from '@/components/ui/password-input';
import { AdminForm as AdminFormType } from '@/types/admin';

/**
 * @interface AdminFormProps
 * @description Properti untuk komponen AdminForm.
 * @property {Partial<AdminFormType>} data - Objek data dari hook useForm Inertia.
 * @property {Function} setData - Fungsi untuk mengubah data form.
 * @property {object} errors - Objek error validasi dari Inertia.
 * @property {boolean} [isEdit=false] - Flag untuk menandakan mode edit.
 */
interface AdminFormProps {
    data: Partial<AdminFormType>;
    setData: (field: keyof AdminFormType, value: any) => void;
    errors: any;
    isEdit?: boolean;
}

/**
 * @name AdminForm
 * @description Komponen form untuk membuat atau mengedit data admin.
 * @param {AdminFormProps} props - Properti komponen.
 * @returns {JSX.Element}
 */
export function AdminForm({
    data,
    setData,
    errors,
    isEdit = false,
}: AdminFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detail Admin</CardTitle>
                <CardDescription>
                    Isi semua informasi yang diperlukan untuk akun admin.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Masukkan nama lengkap admin"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="admin@contoh.com"
                    />
                    <InputError message={errors.email} />
                </div>

                {isEdit && (
                    <>
                        <hr />
                        <p className="text-sm text-muted-foreground">
                            Isi kolom password hanya jika Anda ingin
                            mengubahnya.
                        </p>
                    </>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">
                        {isEdit ? 'Password Baru' : 'Password *'}
                    </Label>
                    <PasswordInput
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                        {isEdit
                            ? 'Konfirmasi Password Baru'
                            : 'Konfirmasi Password *'}
                    </Label>
                    <PasswordInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}